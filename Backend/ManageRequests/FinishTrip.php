<?php

// --- CORS / headers -------------------------------------------------
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

ini_set('display_errors', '0');
error_reporting(E_ALL);

set_error_handler(function ($errno, $errstr, $errfile, $errline) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Server error: $errstr in " . basename($errfile) . " on line $errline"
    ]);
    exit;
});

set_exception_handler(function ($e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Server exception: " . $e->getMessage()
    ]);
    exit;
});

// --- DB connection ----------------------------------------------------
require __DIR__ . "/../db.php";

if (!isset($conn) || $conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed."
    ]);
    exit;
}

// --- Read + validate input --------------------------------------------
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid request body (expected JSON)."
    ]);
    exit;
}

$ticket_id = (int)($data["ticket_id"] ?? 0);

if ($ticket_id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Missing or invalid ticket_id."
    ]);
    exit;
}

// --- Transaction --------------------------------------------------------
// This endpoint only closes out the trip: mark the booking finished and
// free up the driver/vehicle. The actual trip-detail rows (pick_up,
// odometer readings, rfid_balance, etc.) are logged separately, one row
// per stop, by add_odometer.php.
$conn->begin_transaction();

try {

    // Get assigned driver/vehicle (source of truth is BookingTable, not
    // the client payload, so these can't be spoofed)
    $stmt = $conn->prepare("
        SELECT driver_id, vehicle_id
        FROM BookingTable
        WHERE ticket_id = ?
    ");
    if (!$stmt) {
        throw new Exception("Prepare failed (select booking): " . $conn->error);
    }

    $stmt->bind_param("i", $ticket_id);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows == 0) {
        throw new Exception("Booking not found for ticket_id $ticket_id.");
    }

    $booking = $result->fetch_assoc();

    $driver_id  = $booking["driver_id"];
    $vehicle_id = $booking["vehicle_id"];

    $stmt->close();

    // Update booking status
    $stmt = $conn->prepare("
        UPDATE BookingTable
        SET status = 'Finished'
        WHERE ticket_id = ?
    ");
    if (!$stmt) {
        throw new Exception("Prepare failed (update booking): " . $conn->error);
    }

    $stmt->bind_param("i", $ticket_id);
    if (!$stmt->execute()) {
        throw new Exception("Update booking status failed: " . $stmt->error);
    }
    $stmt->close();

    // Driver available again
    $stmt = $conn->prepare("
        UPDATE DriverTable
        SET availability = 1
        WHERE id = ?
    ");
    if (!$stmt) {
        throw new Exception("Prepare failed (update driver): " . $conn->error);
    }

    $stmt->bind_param("i", $driver_id);
    if (!$stmt->execute()) {
        throw new Exception("Update driver availability failed: " . $stmt->error);
    }
    $stmt->close();

    // Vehicle available again
    $stmt = $conn->prepare("
        UPDATE VehicleTable
        SET availability = 1
        WHERE id = ?
    ");
    if (!$stmt) {
        throw new Exception("Prepare failed (update vehicle): " . $conn->error);
    }

    $stmt->bind_param("i", $vehicle_id);
    if (!$stmt->execute()) {
        throw new Exception("Update vehicle availability failed: " . $stmt->error);
    }
    $stmt->close();

    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Trip finished successfully."
    ]);

} catch (Exception $e) {

    $conn->rollback();

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

$conn->close();