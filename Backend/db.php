<?php

$conn = new mysqli(
    "127.0.0.1",
    "root",
    "root",
    "AmkorVehicleBookingSystem"
);


if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}

?>