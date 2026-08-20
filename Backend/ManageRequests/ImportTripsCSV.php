<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require __DIR__ . "/../db.php";

if (!isset($conn) || $conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed."
    ]);
    exit;
}

if (!isset($_FILES["csvFile"]) || empty($_FILES["csvFile"]["tmp_name"])) {
    echo json_encode([
        "success" => false,
        "message" => "No CSV file was uploaded."
    ]);
    exit;
}

$uploadPath = $_FILES["csvFile"]["tmp_name"];

if (!is_uploaded_file($uploadPath)) {
    echo json_encode([
        "success" => false,
        "message" => "Uploaded file is invalid."
    ]);
    exit;
}

// --------------------------------------------------------------------
// Open the file as a real CSV stream (fgetcsv) instead of manually
// splitting on \n. This is the important fix: fgetcsv correctly
// handles quoted fields that contain commas AND quoted fields that
// contain embedded newlines (e.g. a multi-line address), which a
// regex line-split will silently corrupt and shift every column
// after it — which is what was causing rows to fail validation
// and get skipped.
// --------------------------------------------------------------------

$handle = fopen($uploadPath, "r");
if ($handle === false) {
    echo json_encode([
        "success" => false,
        "message" => "Unable to open the uploaded CSV file."
    ]);
    exit;
}

// Strip a UTF-8 BOM if present, without disturbing the rest of the stream
$bom = fread($handle, 3);
if ($bom !== "\xEF\xBB\xBF") {
    rewind($handle);
}

$header = fgetcsv($handle);
if ($header === false || count($header) === 0) {
    fclose($handle);
    echo json_encode([
        "success" => false,
        "message" => "CSV file is empty or missing a header row."
    ]);
    exit;
}

$normalizedHeader = [];
foreach ($header as $columnName) {
    $normalizedHeader[] = strtolower(trim($columnName));
}

$requiredColumns = [
    "ticket_id",
    "pick_up",
    "drop_off",
    "beginning",
    "ending",
    "time_out",
    "time_in",
    "date_finished",
    "rfid_balance",
    "vehicle_id",
    "driver_id",
    "user_id"
];

$missing = [];
foreach ($requiredColumns as $column) {
    if (!in_array($column, $normalizedHeader, true)) {
        $missing[] = $column;
    }
}

if (!empty($missing)) {
    fclose($handle);
    echo json_encode([
        "success" => false,
        "message" => "CSV is missing required columns: " . implode(", ", $missing)
    ]);
    exit;
}

$columnMap = [];
foreach ($normalizedHeader as $index => $column) {
    $columnMap[$column] = $index;
}

$inserted = 0;
$skipped = 0;
$errors = [];
$rowNumber = 1; // header was row 1

while (($row = fgetcsv($handle)) !== false) {
    $rowNumber++;

    // Skip fully blank lines (fgetcsv returns [null] for a blank line)
    if (count($row) === 1 && ($row[0] === null || trim((string)$row[0]) === "")) {
        continue;
    }

    $record = [];
    foreach ($requiredColumns as $column) {
        $index = $columnMap[$column] ?? null;
        $record[$column] = $index !== null && isset($row[$index]) ? trim((string)$row[$index]) : "";
    }

    $ticketId = (int)$record["ticket_id"];
    $pickUp = $record["pick_up"];
    $dropOff = $record["drop_off"];
    $beginning = $record["beginning"];
    $ending = $record["ending"];
    $timeOut = $record["time_out"];
    $timeIn = $record["time_in"];
    $dateFinished = $record["date_finished"];
    $rfidBalance = $record["rfid_balance"];
    $vehicleId = (int)$record["vehicle_id"];
    $driverId = (int)$record["driver_id"];
    $userId = (int)$record["user_id"];

    if (
        $ticketId <= 0 || $pickUp === "" || $dropOff === "" || $beginning === "" ||
        $ending === "" || $timeOut === "" || $timeIn === "" || $dateFinished === "" ||
        $rfidBalance === ""
    ) {
        $errors[] = "Row {$rowNumber} (ticket_id {$ticketId}): missing or invalid required field(s).";
        continue;
    }

    if (!is_numeric($beginning) || !is_numeric($ending) || !is_numeric($rfidBalance)) {
        $errors[] = "Row {$rowNumber} (ticket_id {$ticketId}): beginning, ending, and rfid_balance must be numbers.";
        continue;
    }

    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $dateFinished)) {
        $errors[] = "Row {$rowNumber} (ticket_id {$ticketId}): date_finished must be in YYYY-MM-DD format.";
        continue;
    }

    if (!preg_match('/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/', $timeOut) ||
        !preg_match('/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/', $timeIn)) {
        $errors[] = "Row {$rowNumber} (ticket_id {$ticketId}): time_out/time_in must be HH:MM or HH:MM:SS.";
        continue;
    }

    $beginningValue = (int)$beginning;
    $endingValue = (int)$ending;
    $rfidValue = (int)$rfidBalance;

    if ($endingValue < $beginningValue) {
        $errors[] = "Row {$rowNumber} (ticket_id {$ticketId}): ending odometer is less than beginning odometer.";
        continue;
    }

    // ------------------------------------------------------------------
    // Each row gets its OWN transaction. If this row fails, only this
    // row rolls back — earlier successfully-imported rows in the same
    // CSV are not affected.
    // ------------------------------------------------------------------
    $conn->begin_transaction();

    try {
        $bookingCheck = $conn->prepare("SELECT ticket_id, driver_id, vehicle_id, user_id FROM bookingtable WHERE ticket_id = ?");
        if (!$bookingCheck) {
            throw new Exception("Prepare failed for booking validation: " . $conn->error);
        }
        $bookingCheck->bind_param("i", $ticketId);
        $bookingCheck->execute();
        $bookingResult = $bookingCheck->get_result();

        if ($bookingResult->num_rows === 0) {
            $bookingCheck->close();
            $conn->rollback();
            $errors[] = "Row {$rowNumber}: ticket_id {$ticketId} does not exist in bookingtable.";
            continue;
        }

        $booking = $bookingResult->fetch_assoc();
        $bookingCheck->close();

        $resolvedDriverId = $driverId > 0 ? $driverId : (int)$booking["driver_id"];
        $resolvedVehicleId = $vehicleId > 0 ? $vehicleId : (int)$booking["vehicle_id"];
        $resolvedUserId = $userId > 0 ? $userId : (int)$booking["user_id"];

        if ($resolvedDriverId <= 0 || $resolvedVehicleId <= 0 || $resolvedUserId <= 0) {
            $conn->rollback();
            $errors[] = "Row {$rowNumber}: ticket_id {$ticketId} is missing a valid driver, vehicle, or user.";
            continue;
        }

        // Duplicate check: same ticket, same finish date, same starting odometer
        // means this exact trip was probably already imported.
        $dupCheck = $conn->prepare("SELECT finished_id FROM finishedticket WHERE ticket_id = ? AND date_finished = ? AND beginning = ?");
        if (!$dupCheck) {
            throw new Exception("Prepare failed for duplicate check: " . $conn->error);
        }
        $dupCheck->bind_param("isi", $ticketId, $dateFinished, $beginningValue);
        $dupCheck->execute();
        $dupResult = $dupCheck->get_result();
        $isDuplicate = $dupResult->num_rows > 0;
        $dupCheck->close();

        if ($isDuplicate) {
            $conn->rollback();
            $skipped++;
            continue;
        }

        $stmt = $conn->prepare("INSERT INTO finishedticket (ticket_id, pick_up, drop_off, beginning, ending, time_out, time_in, date_finished, rfid_balance, vehicle_id, driver_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        if (!$stmt) {
            throw new Exception("Prepare failed for finishedticket insert: " . $conn->error);
        }

        $stmt->bind_param(
            "issiisssiiii",
            $ticketId,
            $pickUp,
            $dropOff,
            $beginningValue,
            $endingValue,
            $timeOut,
            $timeIn,
            $dateFinished,
            $rfidValue,
            $resolvedVehicleId,
            $resolvedDriverId,
            $resolvedUserId
        );

        if (!$stmt->execute()) {
            $err = $stmt->error;
            $stmt->close();
            throw new Exception("Insert failed on ticket_id {$ticketId}: " . $err);
        }
        $stmt->close();

        $updateBooking = $conn->prepare("UPDATE bookingtable SET status = 'Finished' WHERE ticket_id = ?");
        if (!$updateBooking) {
            throw new Exception("Prepare failed while updating booking status: " . $conn->error);
        }
        $updateBooking->bind_param("i", $ticketId);
        if (!$updateBooking->execute()) {
            $err = $updateBooking->error;
            $updateBooking->close();
            throw new Exception("Failed to update status for ticket_id {$ticketId}: " . $err);
        }
        $updateBooking->close();

        $driverFree = $conn->prepare("UPDATE drivertable SET availability = 1 WHERE id = ?");
        if ($driverFree) {
            $driverFree->bind_param("i", $resolvedDriverId);
            $driverFree->execute();
            $driverFree->close();
        }

        $vehicleFree = $conn->prepare("UPDATE vehicletable SET availability = 1 WHERE id = ?");
        if ($vehicleFree) {
            $vehicleFree->bind_param("i", $resolvedVehicleId);
            $vehicleFree->execute();
            $vehicleFree->close();
        }

        $conn->commit();
        $inserted++;
    } catch (Throwable $e) {
        $conn->rollback();
        $errors[] = "Row {$rowNumber} (ticket_id {$ticketId}): " . $e->getMessage();
    }
}

fclose($handle);

echo json_encode([
    "success" => true,
    "message" => "Imported {$inserted} trip(s). Skipped {$skipped} duplicate(s).",
    "inserted" => $inserted,
    "skipped" => $skipped,
    "errors" => $errors
]);
exit;