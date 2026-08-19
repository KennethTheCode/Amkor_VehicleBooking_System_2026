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
    finishedticket.finished_id,
    finishedticket.ticket_id,
    finishedticket.pick_up,
    finishedticket.drop_off,
    finishedticket.beginning,
    finishedticket.ending,
    finishedticket.time_out,
    finishedticket.time_in,
    finishedticket.date_finished,
    finishedticket.rfid_balance,

    bookingtable.driver_id,
    drivertable.username AS driver_username,

    bookingtable.vehicle_id,
    vehicletable.vehicle_model

FROM finishedticket

LEFT JOIN bookingtable
    ON finishedticket.ticket_id = bookingtable.ticket_id

LEFT JOIN drivertable
    ON bookingtable.driver_id = drivertable.id

LEFT JOIN vehicletable
    ON bookingtable.vehicle_id = vehicletable.id

ORDER BY finishedticket.date_finished DESC, finishedticket.finished_id DESC
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