<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include "../db.php";

// Matches the <option> values from FilterRequests.jsx
$filter = $_GET["filter"] ?? "";

$allowedStatuses = ["Pending", "Rejected", "Approved"];

$whereClause = "";
$orderClause = "ORDER BY bookingtable.created_at ASC"; // default, same as LoadRequests.php

if (in_array($filter, $allowedStatuses, true)) {
    // Status filters: Pending / Rejected / Approved
    $whereClause = "WHERE bookingtable.status = ?";
} elseif ($filter === "Most Recent") {
    $orderClause = "ORDER BY bookingtable.created_at DESC";
} elseif ($filter === "Oldest") {
    $orderClause = "ORDER BY bookingtable.created_at ASC";
}
// "" (Filter By placeholder) or anything unrecognized -> no filter, default order

$sql = "
SELECT
    bookingtable.ticket_id,
    bookingtable.user_id,
    bookingtable.driver_id,

    usertable.username,

    drivertable.username AS driver_username,

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

$whereClause

GROUP BY
    bookingtable.ticket_id,
    bookingtable.user_id,
    bookingtable.driver_id,

    usertable.username,
    drivertable.username,

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

$orderClause
";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => $conn->error
    ]);
    exit;
}

// Only bind the status parameter when the WHERE clause actually uses one
if ($whereClause !== "") {
    $stmt->bind_param("s", $filter);
}

$stmt->execute();

$result = $stmt->get_result();

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

$stmt->close();
$conn->close();