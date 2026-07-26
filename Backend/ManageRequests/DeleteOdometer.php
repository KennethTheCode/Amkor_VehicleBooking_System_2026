<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // TODO: restrict this in production
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Preflight support, in case the frontend is on a different origin/port
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Only POST requests are allowed.',
    ]);
    exit();
}

include "../db.php";

if (!isset($conn) || $conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed.',
    ]);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

$finished_id = isset($input['finished_id']) ? intval($input['finished_id']) : null;

if (!$finished_id) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Missing or invalid finished_id.',
    ]);
    exit();
}

// ---------------------------------------------------------------------
// Confirmed via phpMyAdmin: database AmkorVehicleBookingSystem,
// table FinishedTicket, primary key finished_id.
// ---------------------------------------------------------------------
$table = 'FinishedTicket';

$stmt = $conn->prepare("DELETE FROM `$table` WHERE finished_id = ? AND date_finished IS NOT NULL LIMIT 1");

if (!$stmt) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to prepare delete statement: ' . $conn->error,
    ]);
    exit();
}

$stmt->bind_param('i', $finished_id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Finished trip deleted successfully.',
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'No matching finished trip found (it may not exist, or the trip is not marked finished yet).',
        ]);
    }
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Delete failed: ' . $stmt->error,
    ]);
}

$stmt->close();
$conn->close();