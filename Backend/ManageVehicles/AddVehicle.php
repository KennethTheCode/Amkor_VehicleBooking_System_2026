<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

include "../db.php";

// Check required fields
if (
    !isset($_POST["vehicle_model"]) ||
    !isset($_POST["color"]) ||
    !isset($_POST["platenumber"]) ||
    !isset($_POST["expiration"]) ||
    !isset($_POST["seater"]) ||
    !isset($_POST["rfid_balance"]) ||
    !isset($_POST["availability"]) ||
    !isset($_FILES["orcr"]) ||
    !isset($_FILES["image"])
) {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required."
    ]);
    exit;
}

$vehicle_model = $_POST["vehicle_model"];
$color = $_POST["color"];
$platenumber = $_POST["platenumber"];
$expiration = $_POST["expiration"];
$seater = (int)$_POST["seater"];
$rfid_balance = (int)$_POST["rfid_balance"];
$availability = (int)$_POST["availability"];
$status = $_POST["status"];

// Upload folders
$orcrFolder = "../uploadsVehicle/orcr/";
$imageFolder = "../uploadsVehicle/vehicle/";

// Create folders if they don't exist
if (!file_exists($orcrFolder)) {
    mkdir($orcrFolder, 0777, true);
}

if (!file_exists($imageFolder)) {
    mkdir($imageFolder, 0777, true);
}

// Check upload errors
if ($_FILES["orcr"]["error"] !== UPLOAD_ERR_OK) {
    echo json_encode([
        "success" => false,
        "message" => "OR/CR upload failed.",
        "error" => $_FILES["orcr"]["error"]
    ]);
    exit;
}

if ($_FILES["image"]["error"] !== UPLOAD_ERR_OK) {
    echo json_encode([
        "success" => false,
        "message" => "Vehicle image upload failed.",
        "error" => $_FILES["image"]["error"]
    ]);
    exit;
}

// Generate unique file names
$orcrName = time() . "_orcr_" . basename($_FILES["orcr"]["name"]);
$imageName = time() . "_vehicle_" . basename($_FILES["image"]["name"]);

$targetOrcr = $orcrFolder . $orcrName;
$targetImage = $imageFolder . $imageName;

// Upload OR/CR
if (!move_uploaded_file($_FILES["orcr"]["tmp_name"], $targetOrcr)) {

    echo json_encode([
        "success" => false,
        "message" => "Could not upload OR/CR.",
        "tmp_name" => $_FILES["orcr"]["tmp_name"],
        "target" => $targetOrcr,
        "folder_exists" => file_exists($orcrFolder),
        "folder_writable" => is_writable($orcrFolder)
    ]);

    exit;
}

// Upload Vehicle Image
if (!move_uploaded_file($_FILES["image"]["tmp_name"], $targetImage)) {

    // Delete OR/CR if image upload fails
    if (file_exists($targetOrcr)) {
        unlink($targetOrcr);
    }

    echo json_encode([
        "success" => false,
        "message" => "Could not upload vehicle image.",
        "tmp_name" => $_FILES["image"]["tmp_name"],
        "target" => $targetImage,
        "folder_exists" => file_exists($imageFolder),
        "folder_writable" => is_writable($imageFolder)
    ]);

    exit;
}

// Paths to save in database
$orcr = "uploadsVehicle/orcr/" . $orcrName;
$image = "uploadsVehicle/vehicle/" . $imageName;

// Insert into database
$sql = "INSERT INTO VehicleTable
(
    vehicle_model,
    color,
    platenumber,
    expiration,
    orcr,
    image,
    seater,
    rfid_balance,
    availability,
    status
)
VALUES
(
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
)";

$stmt = $conn->prepare($sql);

if (!$stmt) {

    echo json_encode([
        "success" => false,
        "message" => $conn->error
    ]);

    exit;
}

$stmt->bind_param(
    "ssssssiiis",
    $vehicle_model,
    $color,
    $platenumber,
    $expiration,
    $orcr,
    $image,
    $seater,
    $rfid_balance,
    $availability,
    $status
);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Vehicle added successfully."
    ]);

} else {

    // Delete uploaded files if database insert fails
    if (file_exists($targetOrcr)) {
        unlink($targetOrcr);
    }

    if (file_exists($targetImage)) {
        unlink($targetImage);
    }

    echo json_encode([
        "success" => false,
        "message" => $stmt->error
    ]);
}

$stmt->close();
$conn->close();

?>