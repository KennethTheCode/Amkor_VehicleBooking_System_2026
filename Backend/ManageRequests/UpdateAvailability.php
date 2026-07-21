<?php

// TEMPORARY - remove once the 500 error is fixed
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

include "../db.php";
include "../sendEmail.php"; // sendEmail.php lives in Backend/, one level up from ManageRequests/

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid request data"
    ]);
    exit;
}

$id = (int)($data["driver_id"] ?? 0);   // Driver ID
$vehicle_id = (int)($data["vehicle_id"] ?? 0);  // Vehicle ID
$ticket_id = (int)($data["ticket_id"] ?? 0);    // Booking Ticket ID
$date_needed = $data["date_needed"] ?? "";      // Booking Date

$currentDate = date("Y-m-d");

$conn->begin_transaction();

try {

    // Approve booking AND assign the driver
    // (previously this only set status, so driver_id never got saved)
    $stmt3 = $conn->prepare("
        UPDATE BookingTable
        SET status = 'Approved',
            driver_id = ?
        WHERE ticket_id = ?
    ");

    if (!$stmt3) {
        throw new Exception($conn->error);
    }

    $stmt3->bind_param("ii", $id, $ticket_id);
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

    // ---- Email the requesting user -------------------------------------
    // Best-effort: email failure should never break the approval response,
    // since the booking update already succeeded and was committed.
    $emailStmt = $conn->prepare("
        SELECT
            UserTable.email AS user_email,
            DriverTable.username AS driver_username,
            BookingTable.pick_up,
            BookingTable.drop_off
        FROM BookingTable
        INNER JOIN UserTable ON BookingTable.user_id = UserTable.user_id
        LEFT JOIN DriverTable ON BookingTable.driver_id = DriverTable.id
        WHERE BookingTable.ticket_id = ?
    ");

    if ($emailStmt) {
        $emailStmt->bind_param("i", $ticket_id);
        $emailStmt->execute();
        $emailRow = $emailStmt->get_result()->fetch_assoc();

        if ($emailRow && !empty($emailRow["user_email"])) {
            $subject = "Your Booking (Ticket #{$ticket_id}) Has Been Approved";
            $body = "
                <p>Hi,</p>
                <p>Your vehicle booking request has been <strong>APPROVED</strong>.</p>
                <table cellpadding='6' cellspacing='0' style='border-collapse:collapse'>
                    <tr><td><strong>Ticket ID:</strong></td><td>{$ticket_id}</td></tr>
                    <tr><td><strong>Driver:</strong></td><td>{$emailRow['driver_username']}</td></tr>
                    <tr><td><strong>Pick-up:</strong></td><td>{$emailRow['pick_up']}</td></tr>
                    <tr><td><strong>Drop-off:</strong></td><td>{$emailRow['drop_off']}</td></tr>
                    <tr><td><strong>Date needed:</strong></td><td>{$date_needed}</td></tr>
                </table>
                <p>Thank you!</p>
            ";

            $emailResult = sendEmailNotification($emailRow["user_email"], $subject, $body);

            if (!$emailResult["success"]) {
                error_log("Email send failed for ticket $ticket_id: " . $emailResult["error"]);
            }
        }
    }
    // ---------------------------------------------------------------------

    echo json_encode([
        "success" => true,
        "message" => ($currentDate === $date_needed)
            ? "Booking approved."
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