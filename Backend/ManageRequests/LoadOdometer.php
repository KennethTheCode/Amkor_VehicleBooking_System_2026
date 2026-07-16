<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include "../db.php";

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