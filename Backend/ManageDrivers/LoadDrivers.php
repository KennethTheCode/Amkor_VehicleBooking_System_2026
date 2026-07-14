<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include "../db.php";

$sql = "SELECT id, username, password, license_no, picture, expiration_date, availability
FROM DriverTable
ORDER BY id DESC";
$result = $conn->query($sql);

$user = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $user[] = [
            'id' => $row['id'],
            'username' => $row['username'],
            'password' => $row['password'],
            'license_no' => $row['license_no'],
            'picture' => $row['picture'],
            'expiration_date' => $row['expiration_date'],
            'availability' => $row['availability'],

        ];
    }
}
echo json_encode($user);

