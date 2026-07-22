<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

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

include "../db.php";

if (!isset($conn) || $conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed."
    ]);
    exit;
}

$sql = "
SELECT
    FinishedTicket.finished_id,
    FinishedTicket.ticket_id,
    FinishedTicket.pick_up,
    FinishedTicket.drop_off,
    FinishedTicket.beginning,
    FinishedTicket.ending,
    FinishedTicket.time_out,
    FinishedTicket.time_in,
    FinishedTicket.date_finished,
    FinishedTicket.rfid_balance,

    BookingTable.driver_id,
    DriverTable.username AS driver_username,

    BookingTable.vehicle_id,
    VehicleTable.vehicle_model

FROM FinishedTicket

LEFT JOIN BookingTable
    ON FinishedTicket.ticket_id = BookingTable.ticket_id

LEFT JOIN DriverTable
    ON BookingTable.driver_id = DriverTable.id

LEFT JOIN VehicleTable
    ON BookingTable.vehicle_id = VehicleTable.id

ORDER BY FinishedTicket.date_finished DESC, FinishedTicket.finished_id DESC
";

$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => $conn->error
    ]);
    exit;
}

$data = [];

while ($row = $result->fetch_assoc()) {
    // Compute total distance travelled for this trip, if both
    // odometer readings are present and valid.
    $row["distance_travelled"] =
        (is_numeric($row["beginning"]) && is_numeric($row["ending"]))
            ? (float)$row["ending"] - (float)$row["beginning"]
            : null;

    $data[] = $row;
}

echo json_encode($data);

$conn->close();