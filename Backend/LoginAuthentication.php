<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (
    !isset($data["username"]) ||
    !isset($data["password"])
) {
    echo json_encode([
        "success" => false,
        "message" => "Username and password are required."
    ]);
    exit;
}

$username = trim($data["username"]);
$password = trim($data["password"]);

$sql = "SELECT user_id, username, password, account_type, picture
        FROM UserTable
        WHERE username = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid username or password."
    ]);
    exit;
}

$user = $result->fetch_assoc();

if ($password !== $user["password"]) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid username or password."
    ]);
    exit;
}

echo json_encode([
    "success" => true,
    "message" => "Login successful.",
    "user" => [
        "user_id" => $user["user_id"],
        "username" => $user["username"],
        "account_type" => $user["account_type"],
        "picture" => $user["picture"]
    ]
]);

$stmt->close();
$conn->close();