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
    $sql = "SELECT id, username, password, email, license_no, expiration_date, picture, availability, status
            FROM DriverTable
            ORDER BY id ASC";

    $result = $conn->query($sql);

} else {

    $search = "%" . $keyword . "%";

    $sql = "SELECT id, username, password, email, license_no, expiration_date, picture, availability, status
            FROM DriverTable
            WHERE username LIKE ?
               OR password LIKE ?
               OR email LIKE ?
               OR license_no LIKE ?
               OR expiration_date LIKE ?
               OR picture LIKE ?
               OR availability LIKE ?
               OR status LIKE ?
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

$driver = [];

while ($row = $result->fetch_assoc()) {
    $driver[] = [
        'id' => $row['id'],
        'username' => $row['username'],
        'password' => $row['password'],
        'email' => $row['email'],
        'license_no' => $row['license_no'],
        'expiration_date' => $row['expiration_date'],
        'picture' => $row['picture'],
        'availability' => $row['availability'],
        'status' => $row['status'],
    ];
}

echo json_encode($driver);

$conn->close();

?>