<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include "../db.php";

$sql = "SELECT id, vehicle_model, color, platenumber, expiration, orcr, image, seater, availability
FROM VehicleTable
ORDER BY id DESC";
$result = $conn->query($sql);

$vehicle = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $vehicle[] = [
            'id' => $row['id'],
            'vehicle_model' => $row['vehicle_model'],
            'color' => $row['color'],
            'platenumber' => $row['platenumber'],
            'expiration' => $row['expiration'],
            'orcr' => $row['orcr'],
            'image' => $row['image'],
            'seater' => $row['seater'],
            'availability' => $row['availability']

        ];
    }
}
echo json_encode($vehicle);

