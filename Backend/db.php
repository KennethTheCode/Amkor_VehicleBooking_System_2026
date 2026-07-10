<?php

$conn = new mysqli(
    "localhost",
    "root",
    "",
    "AmkorVehicleBookingSystem"
);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Connection Failed: " . $conn->connect_error]);
    exit;
}

