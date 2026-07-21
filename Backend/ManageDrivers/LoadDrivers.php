<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include "../db.php";

$sql = "SELECT id, username, password, contact_number, license_no, picture, expiration_date, availability, status
FROM DriverTable
";
$result = $conn->query($sql);

$driver = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $driver[] = [
            'id' => $row['id'],
            'username' => $row['username'],
            'password' => $row['password'],
            'contact_number' => $row['contact_number'],
            'license_no' => $row['license_no'],
            'picture' => $row['picture'],
            'expiration_date' => $row['expiration_date'],
            'availability' => $row['availability'],
            'status' => $row['status'],

        ];
    }
}
echo json_encode($driver);