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
// Adjust this path if db.php lives somewhere else relative to this file.
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

if (
    $ticket_id === 0 ||
    $pick_up === "" ||
    $drop_off === "" ||
    $beginning === "" ||
    $ending === "" ||
    $time_out === "" ||
    $time_in === ""
) {
    echo json_encode([
        "success" => false,
        "message" => "Please complete all fields."
    ]);
    exit;
}

// --- Transaction --------------------------------------------------------
$conn->begin_transaction();

try {

    // Get assigned driver and vehicle
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
    $stmt->execute();
    $stmt->close();
    
    $stmt->bind_param(
        "isssssss",
        $ticket_id,
        $pick_up,
        $drop_off,
        $beginning,
        $ending,
        $time_out,
        $time_in,
        $date_finished
    );

    if (!$stmt->execute()) {
        throw new Exception("Insert failed: " . $stmt->error);
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
    $stmt->execute();
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
    $stmt->execute();
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