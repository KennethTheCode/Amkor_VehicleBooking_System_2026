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

$id = (int)($data["id"] ?? 0);                  // Driver ID
$vehicle_id = (int)($data["vehicle_id"] ?? 0);  // Vehicle ID
$ticket_id = (int)($data["ticket_id"] ?? 0);    // Booking Ticket ID
$date_needed = $data["date_needed"] ?? "";      // Booking Date

$currentDate = date("Y-m-d");

$conn->begin_transaction();

try {

    // Approve booking
    $stmt3 = $conn->prepare("
        UPDATE BookingTable
        SET status = 'Approved'
        WHERE ticket_id = ?
    ");

    if (!$stmt3) {
        throw new Exception($conn->error);
    }

    $stmt3->bind_param("i", $ticket_id);
    $stmt3->execute();

    // Update availability ONLY if today is the scheduled date
    if ($currentDate === $date_needed) {

        // Update driver availability
        $stmt1 = $conn->prepare("
            UPDATE DriverTable
            SET availability = 0
            WHERE id = ?
        ");

        if (!$stmt1) {
            throw new Exception($conn->error);
        }

        $stmt1->bind_param("i", $id);
        $stmt1->execute();

        // Update vehicle availability
        $stmt2 = $conn->prepare("
            UPDATE VehicleTable
            SET availability = 0
            WHERE id = ?
        ");

        if (!$stmt2) {
            throw new Exception($conn->error);
        }

        $stmt2->bind_param("i", $vehicle_id);
        $stmt2->execute();
    }

    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => ($currentDate === $date_needed)
            ? "Driver Unavailable"
            : "Booking approved. Driver and vehicle remain available until $date_needed."
    ]);

} catch (Exception $e) {

    $conn->rollback();

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

$conn->close();