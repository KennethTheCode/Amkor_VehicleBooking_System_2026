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

// --- Insert only: record the finished trip ------------------------------
try {

    $stmt = $conn->prepare("
        INSERT INTO FinishedTicket
        (
            ticket_id,
            pick_up,
            drop_off,
            beginning,
            ending,
            time_out,
            time_in,
            date_finished
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
    ");

    if (!$stmt) {
        throw new Exception("Prepare failed (insert finished ticket): " . $conn->error);
    }

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

    echo json_encode([
        "success" => true,
        "message" => "Trip record saved successfully."
    ]);

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

$conn->close();