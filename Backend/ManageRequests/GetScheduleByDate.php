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
    BookingTable.ticket_id,
    BookingTable.driver_id,
    DriverTable.username AS driver_username,

    BookingTable.vehicle_id,
    VehicleTable.vehicle_model,

    BookingTable.date_needed,
    BookingTable.time_needed

FROM BookingTable

LEFT JOIN DriverTable
    ON BookingTable.driver_id = DriverTable.id

LEFT JOIN VehicleTable
    ON BookingTable.vehicle_id = VehicleTable.id

WHERE
    BookingTable.status = 'Approved'
    AND BookingTable.date_needed = ?

ORDER BY BookingTable.time_needed
";

$stmt = $conn->prepare($sql);
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