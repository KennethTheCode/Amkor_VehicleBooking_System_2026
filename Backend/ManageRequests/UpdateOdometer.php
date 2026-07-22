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

// Make sure PHP errors never leak as raw HTML into what the frontend
// expects to be JSON. Instead, convert them into a JSON error response.
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

$ticket_id     = (int)($data["ticket_id"] ?? 0);
$pick_up       = trim($data["pick_up"] ?? "");
$drop_off      = trim($data["drop_off"] ?? "");
$beginning     = trim($data["beginning"] ?? "");
$ending        = trim($data["ending"] ?? "");
$time_out      = trim($data["time_out"] ?? "");
$time_in       = trim($data["time_in"] ?? "");
$date_finished = trim($data["date_finished"] ?? date("Y-m-d"));
$rfid_balance  = trim($data["rfid_balance"] ?? "");

if (
    $ticket_id === 0 ||
    $pick_up === "" ||
    $drop_off === "" ||
    $beginning === "" ||
    $ending === "" ||
    $time_out === "" ||
    $time_in === "" ||
    $rfid_balance === ""
) {
    echo json_encode([
        "success" => false,
        "message" => "Please complete all fields."
    ]);
    exit;
}

$beginning    = (int)$beginning;
$ending       = (int)$ending;
$rfid_balance = (int)$rfid_balance;

// --- Insert a new stop: every "Add Odometer" click logs its own row ----
try {

    // Look up driver/vehicle/user this booking belongs to. FinishedTicket
    // requires these (NOT NULL, no default) — but they're already known
    // as soon as a driver's assigned, well before the trip actually ends.
    $bookingStmt = $conn->prepare("
        SELECT driver_id, vehicle_id, user_id
        FROM BookingTable
        WHERE ticket_id = ?
    ");

    if (!$bookingStmt) {
        throw new Exception("Prepare failed (select booking): " . $conn->error);
    }

    $bookingStmt->bind_param("i", $ticket_id);
    $bookingStmt->execute();
    $bookingResult = $bookingStmt->get_result();

    if ($bookingResult->num_rows === 0) {
        throw new Exception("Booking not found for ticket_id $ticket_id.");
    }

    $booking    = $bookingResult->fetch_assoc();
    $driver_id  = $booking["driver_id"];
    $vehicle_id = $booking["vehicle_id"];
    $user_id    = $booking["user_id"];
    $bookingStmt->close();

    // rfid_balance now comes directly from the request (user enters it
    // each time they add an odometer stop) instead of a hardcoded
    // placeholder.
    $stmt = $conn->prepare("
        INSERT INTO FinishedTicket
            (ticket_id, pick_up, drop_off, beginning, ending, time_out, time_in, date_finished, rfid_balance, vehicle_id, driver_id, user_id)
        VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    if (!$stmt) {
        throw new Exception("Prepare failed (insert finished ticket): " . $conn->error);
    }

    $stmt->bind_param(
        "issiisssiiii",
        $ticket_id,
        $pick_up,
        $drop_off,
        $beginning,
        $ending,
        $time_out,
        $time_in,
        $date_finished,
        $rfid_balance,
        $vehicle_id,
        $driver_id,
        $user_id
    );

    if (!$stmt->execute()) {
        throw new Exception("Insert failed: " . $stmt->error);
    }

    $stmt->close();

    echo json_encode([
        "success" => true,
        "message" => "Stop recorded successfully."
    ]);

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

$conn->close();