<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include "../db.php";

$sql = "
SELECT
    BookingTable.ticket_id,
    BookingTable.user_id,
    BookingTable.driver_id,

    UserTable.username,

    DriverTable.username AS driver_username,

    VehicleTable.id AS vehicle_id,
    VehicleTable.vehicle_model,
    VehicleTable.image,

    GROUP_CONCAT(PassengerTable.passengers SEPARATOR ', ') AS passengers,

    BookingTable.pick_up,
    BookingTable.drop_off,
    BookingTable.purpose,
    BookingTable.date_needed,
    BookingTable.time_needed,
    BookingTable.status,
    BookingTable.created_at

FROM BookingTable

INNER JOIN UserTable
    ON BookingTable.user_id = UserTable.user_id

INNER JOIN VehicleTable
    ON BookingTable.vehicle_id = VehicleTable.id

LEFT JOIN DriverTable
    ON BookingTable.driver_id = DriverTable.id

LEFT JOIN PassengerTable
    ON BookingTable.ticket_id = PassengerTable.ticket_id

GROUP BY
    BookingTable.ticket_id,
    BookingTable.user_id,
    BookingTable.driver_id,

    UserTable.username,
    DriverTable.username,

    VehicleTable.id,
    VehicleTable.vehicle_model,
    VehicleTable.image,

    BookingTable.pick_up,
    BookingTable.drop_off,
    BookingTable.purpose,
    BookingTable.date_needed,
    BookingTable.time_needed,
    BookingTable.status,
    BookingTable.created_at

ORDER BY BookingTable.created_at ASC
";

$result = $conn->query($sql);

if (!$result) {
    echo json_encode([
        "success" => false,
        "message" => $conn->error
    ]);
    exit;
}

$tickets = [];

while ($row = $result->fetch_assoc()) {

    $tickets[] = [
        "ticket_id"       => $row["ticket_id"],
        "user_id"         => $row["user_id"],
        "driver_id"       => $row["driver_id"],

        "username"        => $row["username"],
        "driver_username" => $row["driver_username"],

        "vehicle_id"      => $row["vehicle_id"],
        "vehicle_model"   => $row["vehicle_model"],
        "image"           => $row["image"],

        "passengers"      => $row["passengers"],

        "pick_up"         => $row["pick_up"],
        "drop_off"        => $row["drop_off"],
        "purpose"         => $row["purpose"],
        "date_needed"     => $row["date_needed"],
        "time_needed"     => $row["time_needed"],
        "status"          => $row["status"],
        "created_at"      => $row["created_at"]
    ];
}

echo json_encode($tickets);

$conn->close();