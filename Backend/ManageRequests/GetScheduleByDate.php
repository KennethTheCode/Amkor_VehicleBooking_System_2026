<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include "../db.php";

$date = $_GET["date"] ?? "";

if (empty($date)) {
    echo json_encode([]);
    exit;
}

$sql = "
SELECT
    bookingtable.ticket_id,
    bookingtable.driver_id,
    drivertable.username AS driver_username,

    bookingtable.vehicle_id,
    vehicletable.vehicle_model,

    bookingtable.date_needed,
    bookingtable.time_needed

FROM bookingtable

LEFT JOIN drivertable
    ON bookingtable.driver_id = drivertable.id

LEFT JOIN vehicletable
    ON bookingtable.vehicle_id = vehicletable.id

WHERE
    bookingtable.status = 'Approved'
    AND bookingtable.date_needed = ?

ORDER BY bookingtable.time_needed
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

$stmt->bind_param("s", $date);
$stmt->execute();

$result = $stmt->get_result();

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);

$stmt->close();
$conn->close();