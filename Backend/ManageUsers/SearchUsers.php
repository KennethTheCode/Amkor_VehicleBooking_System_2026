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
    $sql = "SELECT user_id, username, password, email, account_type, picture, status
            FROM UserTable
            ORDER BY user_id ASC";

    $result = $conn->query($sql);

} else {

    $search = "%" . $keyword . "%";

    $sql = "SELECT user_id, username, password, email, account_type, picture, status
            FROM UserTable
            WHERE username LIKE ?
               OR password LIKE ?
               OR email LIKE ?
               OR account_type LIKE ?
               OR status LIKE ?
            ORDER BY user_id ASC";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        "ssss",
        $search,
        $search,
        $search,
        $search
    );

    $stmt->execute();
    $result = $stmt->get_result();
}

$user = [];

while ($row = $result->fetch_assoc()) {
    $user[] = [
        'user_id' => $row['user_id'],
        'username' => $row['username'],
        'password' => $row['password'],
        'email' => $row['email'],
        'account_type' => $row['account_type'],
        'picture' => $row['picture'],
        'status' => $row['status'],
    ];
}

echo json_encode($user);

$conn->close();