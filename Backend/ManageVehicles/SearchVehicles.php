<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include "../db.php";

$data = json_decode(file_get_contents("php://input"), true);

$keyword = trim($data["keyword"] ?? "");

if ($keyword == "") {
    $sql = "SELECT id, vehicle_model, color, platenumber, expiration, seater, orcr, image, availability
            FROM VehicleTable
            ORDER BY id ASC";

    $result = $conn->query($sql);

} else {

    $search = "%" . $keyword . "%";

    $sql = "SELECT vehicle_model, color, platenumber, expiration, seater, orcr, image, availability
            FROM VehicleTable
            WHERE vehicle_model LIKE ?
               OR color LIKE ?
               OR platenumber LIKE ?
               OR expiration LIKE ?
               OR orcr LIKE ?
               OR image LIKE ?
               OR availability LIKE ?
               OR seater LIKE ?
            ORDER BY id ASC";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        "ssssssss",
        $search,
        $search,
        $search,
        $search,
        $search,
        $search,
        $search,
        $search
    );

    $stmt->execute();
    $result = $stmt->get_result();
}

$vehicles = [];

while ($row = $result->fetch_assoc()) {
    $vehicles[] = [
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

echo json_encode($vehicles);

$conn->close();

?>