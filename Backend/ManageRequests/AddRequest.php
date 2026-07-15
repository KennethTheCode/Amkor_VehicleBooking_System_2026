<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

ini_set('display_errors', 1);
error_reporting(E_ALL);

include "../db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "No data received."
    ]);
    exit;
}

/*
|--------------------------------------------------------------------------
| Retrieve Data
|--------------------------------------------------------------------------
*/

$user_id = $data["user_id"] ?? null;
$vehicle_id = $data["vehicle_id"] ?? null;

$pick_up = trim($data["pick_up"] ?? "");
$drop_off = trim($data["drop_off"] ?? "");
$purpose = trim($data["purpose"] ?? "");

$date_needed = $data["date_needed"] ?? "";
$time_needed = $data["time_needed"] ?? "";

$passenger_names = $data["passenger_names"] ?? [];

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

if (
    empty($user_id) ||
    empty($vehicle_id) ||
    empty($pick_up) ||
    empty($drop_off) ||
    empty($purpose) ||
    empty($date_needed) ||
    empty($time_needed)
) {
    echo json_encode([
        "success" => false,
        "message" => "Please complete all required fields."
    ]);
    exit;
}

$conn->begin_transaction();

try {

    $status = "Pending";
    $created_at = date("Y-m-d H:i:s");

    /*
    |--------------------------------------------------------------------------
    | Insert Booking
    |--------------------------------------------------------------------------
    */

    $stmt = $conn->prepare("
        INSERT INTO BookingTable
        (
            user_id,
            vehicle_id,
            pick_up,
            drop_off,
            purpose,
            date_needed,
            time_needed,
            status,
            created_at
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    if (!$stmt) {
        throw new Exception($conn->error);
    }

    $stmt->bind_param(
        "iisssssss",
        $user_id,
        $vehicle_id,
        $pick_up,
        $drop_off,
        $purpose,
        $date_needed,
        $time_needed,
        $status,
        $created_at
    );

    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }

    $ticket_id = $conn->insert_id;

    /*
    |--------------------------------------------------------------------------
    | Insert Passenger Names
    |--------------------------------------------------------------------------
    */

    if (!empty($passenger_names)) {

        $stmtPassenger = $conn->prepare("
            INSERT INTO PassengerTable
            (
                ticket_id,
                passengers
            )
            VALUES
            (?, ?)
        ");

        if (!$stmtPassenger) {
            throw new Exception($conn->error);
        }

        foreach ($passenger_names as $name) {

            $name = trim($name);

            if ($name == "") {
                continue;
            }

            $stmtPassenger->bind_param(
                "is",
                $ticket_id,
                $name
            );

            if (!$stmtPassenger->execute()) {
                throw new Exception($stmtPassenger->error);
            }
        }

        $stmtPassenger->close();
    }

    $stmt->close();

    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Booking submitted successfully.",
        "ticket_id" => $ticket_id
    ]);

} catch (Throwable $e) {

    $conn->rollback();

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage(),
        "line" => $e->getLine(),
        "file" => $e->getFile()
    ]);
}

$conn->close();

?>