<?php

$conn = new mysqli(
    "127.0.0.1",
    "root",
    "",
    "amkorvehiclebookingsystem"
);

if ($conn->connect_error) {
    http_response_code(500);
    header("Content-Type: application/json");
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed: " . $conn->connect_error
    ]);
    exit;
}

?>