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

$ticket_id = isset($input['ticket_id']) ? intval($input['ticket_id']) : null;

if (!$ticket_id) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Missing or invalid ticket_id.',
    ]);
    exit();
}

$conn->begin_transaction();

// ---------------------------------------------------------------------
// Delete related FinishedTicket rows first (a ticket can have multiple
// finished-trip rows, confirmed via phpMyAdmin), then the ticket itself
// from BookingTable.
//
// TODO: PassengerTable was also listed in your phpMyAdmin sidebar. If it
// stores rows keyed by ticket_id, add the same delete-and-check block for
// it here (before the BookingTable delete) — otherwise this will either
// leave orphaned passenger rows, or fail outright if there's a foreign
// key constraint requiring it to go first.
// ---------------------------------------------------------------------

$stmt1 = $conn->prepare("DELETE FROM `FinishedTicket` WHERE ticket_id = ?");
if (!$stmt1) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to prepare finished-trip delete: ' . $conn->error,
    ]);
    exit();
}
$stmt1->bind_param('i', $ticket_id);
if (!$stmt1->execute()) {
    $error = $stmt1->error;
    $stmt1->close();
    $conn->rollback();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to delete related finished trips: ' . $error,
    ]);
    exit();
}
$stmt1->close();

// ---------------------------------------------------------------------
// TODO: confirm BookingTable's primary key column is really "ticket_id" —
// I'm assuming this matches the foreign key name used in FinishedTicket,
// but I haven't seen BookingTable's actual structure.
// ---------------------------------------------------------------------
$stmt2 = $conn->prepare("DELETE FROM `BookingTable` WHERE ticket_id = ?");
if (!$stmt2) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to prepare ticket delete: ' . $conn->error,
    ]);
    exit();
}
$stmt2->bind_param('i', $ticket_id);

if ($stmt2->execute()) {
    if ($stmt2->affected_rows > 0) {
        $stmt2->close();
        $conn->commit();
        echo json_encode([
            'success' => true,
            'message' => 'Ticket and its related records deleted successfully.',
        ]);
    } else {
        $stmt2->close();
        $conn->rollback();
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'No ticket found with that ticket_id.',
        ]);
    }
} else {
    $error = $stmt2->error;
    $stmt2->close();
    $conn->rollback();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Delete failed: ' . $error,
    ]);
}

$conn->close();