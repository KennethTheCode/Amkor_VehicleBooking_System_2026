<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include "../db.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = isset($data["vehicle_id"]) ? intval($data["vehicle_id"]) : 0;
$status = isset($data["status"]) ? $data["status"] : "";

$allowedStatuses = ["Enabled", "Disabled"];

if ($id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid vehicle ID."
    ]);
    exit;
}

if (!in_array($status, $allowedStatuses)) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid status value."
    ]);
    exit;
}

$sql = "UPDATE VehicleTable SET status = ? WHERE id = ?";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "success" => false,
        "message" => $conn->error
    ]);
    exit;
}

$stmt->bind_param("si", $status, $id);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => $status === "Disabled" ? "Vehicle disabled successfully." : "Vehicle enabled successfully."
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => $stmt->error
    ]);
}

$stmt->close();
$conn->close();