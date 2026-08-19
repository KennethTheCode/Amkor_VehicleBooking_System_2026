<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include "../db.php";

$sql = "
SELECT
    bookingtable.ticket_id,
    bookingtable.user_id,
    bookingtable.driver_id,

    usertable.username,
    usertable.email AS user_email,

    drivertable.username AS driver_username,
    drivertable.email AS driver_email,

    vehicletable.id AS vehicle_id,
    vehicletable.vehicle_model,
    vehicletable.image,

    GROUP_CONCAT(passengertable.passengers SEPARATOR ', ') AS passengers,

    bookingtable.pick_up,
    bookingtable.drop_off,
    bookingtable.purpose,
    bookingtable.date_needed,
    bookingtable.time_needed,
    bookingtable.status,
    bookingtable.created_at

FROM bookingtable

INNER JOIN usertable
    ON bookingtable.user_id = usertable.user_id

INNER JOIN vehicletable
    ON bookingtable.vehicle_id = vehicletable.id

LEFT JOIN drivertable
    ON bookingtable.driver_id = drivertable.id

LEFT JOIN passengertable
    ON bookingtable.ticket_id = passengertable.ticket_id

GROUP BY
    bookingtable.ticket_id,
    bookingtable.user_id,
    bookingtable.driver_id,

    usertable.username,
    usertable.email,

    drivertable.username,
    drivertable.email,

    vehicletable.id,
    vehicletable.vehicle_model,
    vehicletable.image,

    bookingtable.pick_up,
    bookingtable.drop_off,
    bookingtable.purpose,
    bookingtable.date_needed,
    bookingtable.time_needed,
    bookingtable.status,
    bookingtable.created_at

ORDER BY bookingtable.created_at ASC
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
        "user_email"      => $row["user_email"],

        "driver_username" => $row["driver_username"],
        "driver_email"    => $row["driver_email"],

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