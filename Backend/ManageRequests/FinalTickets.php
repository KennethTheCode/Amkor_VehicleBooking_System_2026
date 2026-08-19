<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include "../db.php";

$ticket_id = isset($_GET['ticket_id']) ? $_GET['ticket_id'] : null;

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
    bookingtable.created_at,

    finishedticket.pick_up AS pick_up_final,
    finishedticket.drop_off AS drop_off_final,
    finishedticket.finished_id,
    finishedticket.beginning,
    finishedticket.ending,
    (finishedticket.ending - finishedticket.beginning) AS distance_travelled,
    finishedticket.time_out,
    finishedticket.time_in,
    finishedticket.date_finished,
    finishedticket.rfid_balance

FROM bookingtable

INNER JOIN usertable
    ON bookingtable.user_id = usertable.user_id

INNER JOIN vehicletable
    ON bookingtable.vehicle_id = vehicletable.id

LEFT JOIN drivertable
    ON bookingtable.driver_id = drivertable.id

LEFT JOIN passengertable
    ON bookingtable.ticket_id = passengertable.ticket_id

LEFT JOIN finishedticket
    ON bookingtable.ticket_id = finishedticket.ticket_id
";

$params = [];
$types = "";

if ($ticket_id !== null) {
    $sql .= " WHERE bookingtable.ticket_id = ? ";
    $types .= "i";
    $params[] = $ticket_id;
}

$sql .= "
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
    bookingtable.created_at,

    finishedticket.finished_id,
    finishedticket.beginning,
    finishedticket.ending,
    finishedticket.time_out,
    finishedticket.time_in,
    finishedticket.date_finished,
    finishedticket.rfid_balance

ORDER BY bookingtable.created_at ASC
";

// Using a prepared statement here (instead of $conn->query directly like the
// reference file) since ticket_id can come from user input via $_GET —
// this avoids SQL injection when the filter is used.
if ($ticket_id !== null) {
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(["success" => false, "message" => $conn->error]);
        exit;
    }
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    $result = $conn->query($sql);
}

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
        "created_at"      => $row["created_at"],
        "pick_up_final"   => $row["pick_up_final"],
        "drop_off_final"      => $row["drop_off_final"],
        "finished_id"         => $row["finished_id"],
        "beginning"           => $row["beginning"],
        "ending"              => $row["ending"],
        "distance_travelled"  => $row["distance_travelled"],
        "time_out"            => $row["time_out"],
        "time_in"             => $row["time_in"],
        "date_finished"       => $row["date_finished"],
        "rfid_balance"        => $row["rfid_balance"]
    ];
}

echo json_encode($tickets);

$conn->close();