<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

$conn = new mysqli(
    "sql202.infinityfree.com",
    "if0_42429955",
    "YOUR_VPANEL_PASSWORD",
    "if0_42429955_AmkorVehicleBookingSystem"
);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "Database connected successfully!";