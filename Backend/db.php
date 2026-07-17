<?php

$conn = new mysqli(
    "localhost",
    "root",
    "",
    "amkorvehiclebookingsystem"
);

if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode([
        "success" => false,
        "message" => "Connection Failed: " . $conn->connect_error
    ]));
}