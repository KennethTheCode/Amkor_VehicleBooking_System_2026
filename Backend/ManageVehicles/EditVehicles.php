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

// Check required text fields
if (
    !isset($_POST["vehicle_id"]) ||
    !isset($_POST["vehicle_model"]) ||
    !isset($_POST["color"]) ||
    !isset($_POST["platenumber"]) ||
    !isset($_POST["expiration"]) ||
    !isset($_POST["seater"]) ||
    !isset($_POST["rfid_balance"])
) {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required."
    ]);
    exit;
}

$vehicle_id = intval($_POST["vehicle_id"]);
$vehicle_model = trim($_POST["vehicle_model"]);
$color = trim($_POST["color"]);
$platenumber = trim($_POST["platenumber"]);
$expiration = $_POST["expiration"];
$seater = (int)$_POST["seater"];
$rfid_balance = (int)$_POST["rfid_balance"];

if (
    $vehicle_id <= 0 ||
    $vehicle_model === "" ||
    $color === "" ||
    $platenumber === "" ||
    $expiration === ""
) {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required."
    ]);
    exit;
}

// --- Look up the existing vehicle (needed to keep/replace orcr and image) ---
$lookup = $conn->prepare("SELECT orcr, image FROM VehicleTable WHERE id = ?");
$lookup->bind_param("i", $vehicle_id);
$lookup->execute();
$result = $lookup->get_result();

if ($result->num_rows === 0) {
    $lookup->close();
    echo json_encode([
        "success" => false,
        "message" => "Vehicle not found."
    ]);
    exit;
}

$existingVehicle = $result->fetch_assoc();
$lookup->close();

$orcr = $existingVehicle["orcr"];
$image = $existingVehicle["image"];

$newOrcrSaved = false;
$newImageSaved = false;
$targetOrcr = null;
$targetImage = null;
$oldOrcrPath = null;
$oldImagePath = null;

$orcrFolder = "../uploadsVehicle/orcr/";
$imageFolder = "../uploadsVehicle/vehicle/";

// --- Handle optional OR/CR replacement ---
if (isset($_FILES["orcr"]) && $_FILES["orcr"]["error"] !== UPLOAD_ERR_NO_FILE) {

    if ($_FILES["orcr"]["error"] !== UPLOAD_ERR_OK) {
        echo json_encode([
            "success" => false,
            "message" => "OR/CR upload failed.",
            "error" => $_FILES["orcr"]["error"]
        ]);
        exit;
    }

    if (!file_exists($orcrFolder)) {
        mkdir($orcrFolder, 0777, true);
    }

    $orcrName = time() . "_orcr_" . basename($_FILES["orcr"]["name"]);
    $targetOrcr = $orcrFolder . $orcrName;

    if (!move_uploaded_file($_FILES["orcr"]["tmp_name"], $targetOrcr)) {
        echo json_encode([
            "success" => false,
            "message" => "Could not upload OR/CR."
        ]);
        exit;
    }

    $newOrcrSaved = true;
    $oldOrcrPath = dirname(__DIR__) . "/" . $orcr;
    $orcr = "uploadsVehicle/orcr/" . $orcrName;
}

// --- Handle optional vehicle image replacement ---
if (isset($_FILES["image"]) && $_FILES["image"]["error"] !== UPLOAD_ERR_NO_FILE) {

    if ($_FILES["image"]["error"] !== UPLOAD_ERR_OK) {
        if ($newOrcrSaved && file_exists($targetOrcr)) {
            unlink($targetOrcr);
        }
        echo json_encode([
            "success" => false,
            "message" => "Vehicle image upload failed.",
            "error" => $_FILES["image"]["error"]
        ]);
        exit;
    }

    if (!file_exists($imageFolder)) {
        mkdir($imageFolder, 0777, true);
    }

    $imageName = time() . "_vehicle_" . basename($_FILES["image"]["name"]);
    $targetImage = $imageFolder . $imageName;

    if (!move_uploaded_file($_FILES["image"]["tmp_name"], $targetImage)) {
        if ($newOrcrSaved && file_exists($targetOrcr)) {
            unlink($targetOrcr);
        }
        echo json_encode([
            "success" => false,
            "message" => "Could not upload vehicle image."
        ]);
        exit;
    }

    $newImageSaved = true;
    $oldImagePath = dirname(__DIR__) . "/" . $image;
    $image = "uploadsVehicle/vehicle/" . $imageName;
}

// --- Update vehicle ---
$sql = "UPDATE VehicleTable
SET vehicle_model = ?, color = ?, platenumber = ?, expiration = ?, seater = ?, rfid_balance = ?, orcr = ?, image = ?
WHERE id = ?";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    if ($newOrcrSaved && file_exists($targetOrcr)) {
        unlink($targetOrcr);
    }
    if ($newImageSaved && file_exists($targetImage)) {
        unlink($targetImage);
    }
    echo json_encode([
        "success" => false,
        "message" => $conn->error
    ]);
    exit;
}

// Type string: vehicle_model(s) color(s) platenumber(s) expiration(s)
// seater(i) rfid_balance(i) orcr(s) image(s) vehicle_id(i) = 9 chars for 9 vars
$stmt->bind_param(
    "ssssiissi",
    $vehicle_model,
    $color,
    $platenumber,
    $expiration,
    $seater,
    $rfid_balance,
    $orcr,
    $image,
    $vehicle_id
);

if ($stmt->execute()) {
    // Clean up old files now that the new ones are confirmed saved
    if ($newOrcrSaved && $oldOrcrPath && file_exists($oldOrcrPath)) {
        unlink($oldOrcrPath);
    }
    if ($newImageSaved && $oldImagePath && file_exists($oldImagePath)) {
        unlink($oldImagePath);
    }

    $response = [
        "success" => true,
        "message" => "Vehicle updated successfully."
    ];

    if ($newOrcrSaved) {
        $response["orcr"] = $orcr;
    }
    if ($newImageSaved) {
        $response["image"] = $image;
    }

    echo json_encode($response);
} else {
    if ($newOrcrSaved && file_exists($targetOrcr)) {
        unlink($targetOrcr);
    }
    if ($newImageSaved && file_exists($targetImage)) {
        unlink($targetImage);
    }
    echo json_encode([
        "success" => false,
        "message" => $stmt->error
    ]);
}

$stmt->close();
$conn->close();