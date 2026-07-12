<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include "db.php";

$sql = "SELECT user_id, username, password, account_type, picture
FROM UserTable";
$result = $conn->query($sql);

$user = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $user[] = [
            'user_id' => $row['user_id'],
            'username' => $row['username'],
            'password' => $row['password'],
            'account_type' => $row['account_type'],
            'picture' => $row['picture']
        ];
    }
}
echo json_encode($user);

