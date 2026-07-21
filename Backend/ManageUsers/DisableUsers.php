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

$id = isset($data["user_id"]) ? intval($data["user_id"]) : 0;

if ($id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid user ID."
    ]);
    exit;
}

$sql = "UPDATE UserTable SET status = 'Disabled' WHERE user_id = ?";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "success" => false,
        "message" => $conn->error
    ]);
    exit;
}

$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "User disabled successfully."
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => $stmt->error
    ]);
}

$stmt->close();
$conn->close();