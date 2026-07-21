<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

include "../db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid request data"
    ]);
    exit;
}

$ticket_id = (int)($data["ticket_id"] ?? 0);

if ($ticket_id === 0) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Missing ticket id."
    ]);
    exit;
}

try {

    // Only allow rejecting a booking that's still Pending —
    // stops an Approved/Ongoing/Finished ticket from being
    // flipped to Rejected by mistake.
    $checkStmt = $conn->prepare("
        SELECT status
        FROM BookingTable
        WHERE ticket_id = ?
    ");

    if (!$checkStmt) {
        throw new Exception($conn->error);
    }

    $checkStmt->bind_param("i", $ticket_id);
    $checkStmt->execute();
    $result = $checkStmt->get_result();

    if ($result->num_rows === 0) {
        throw new Exception("Booking not found.");
    }

    $booking = $result->fetch_assoc();
    $checkStmt->close();

    if ($booking["status"] !== "Pending") {
        throw new Exception("Only pending bookings can be rejected.");
    }

    $stmt = $conn->prepare("
        UPDATE BookingTable
        SET status = 'Rejected'
        WHERE ticket_id = ?
    ");

    if (!$stmt) {
        throw new Exception($conn->error);
    }

    $stmt->bind_param("i", $ticket_id);
    $stmt->execute();
    $stmt->close();

    echo json_encode([
        "success" => true,
        "message" => "Ticket rejected."
    ]);

} catch (Exception $e) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

$conn->close();