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
        "message" => "Invalid request data."
    ]);
    exit;
}

$ticket_id = (int)($data["ticket_id"] ?? 0);

if ($ticket_id === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Missing ticket id."
    ]);
    exit;
}

$conn->begin_transaction();

try {

    // Only allow the transition FROM 'Approved' TO 'Ongoing' —
    // this prevents accidentally starting a trip that was never
    // approved, or re-starting one that's already Ongoing/Finished.
    $stmt = $conn->prepare("
        SELECT driver_id, vehicle_id, status
        FROM BookingTable
        WHERE ticket_id = ?
    ");

    if (!$stmt) {
        throw new Exception($conn->error);
    }

    $stmt->bind_param("i", $ticket_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        throw new Exception("Booking not found.");
    }

    $booking = $result->fetch_assoc();
    $stmt->close();

    if ($booking["status"] !== "Approved") {
        throw new Exception("Only approved bookings can be set to Ongoing.");
    }

    $driver_id  = (int)$booking["driver_id"];
    $vehicle_id = (int)$booking["vehicle_id"];

    // Update booking status
    $stmt = $conn->prepare("
        UPDATE BookingTable
        SET status = 'Ongoing'
        WHERE ticket_id = ?
    ");

    if (!$stmt) {
        throw new Exception($conn->error);
    }

    $stmt->bind_param("i", $ticket_id);
    $stmt->execute();
    $stmt->close();

    // Mark driver as unavailable now that the trip has started
    if ($driver_id > 0) {
        $stmt = $conn->prepare("
            UPDATE DriverTable
            SET availability = 0
            WHERE id = ?
        ");

        if (!$stmt) {
            throw new Exception($conn->error);
        }

        $stmt->bind_param("i", $driver_id);
        $stmt->execute();
        $stmt->close();
    }

    // Mark vehicle as unavailable now that the trip has started
    if ($vehicle_id > 0) {
        $stmt = $conn->prepare("
            UPDATE VehicleTable
            SET availability = 0
            WHERE id = ?
        ");

        if (!$stmt) {
            throw new Exception($conn->error);
        }

        $stmt->bind_param("i", $vehicle_id);
        $stmt->execute();
        $stmt->close();
    }

    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Trip is now Ongoing."
    ]);

} catch (Exception $e) {

    $conn->rollback();

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

$conn->close();