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
    !isset($_POST["username"]) ||
    !isset($_POST["password"]) ||
    !isset($_POST["license_no"]) ||
    !isset($_POST["expiration_date"]) ||
    !isset($_FILES["picture"])
) {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required."
    ]);
    exit;
}

$username = $_POST["username"];
$password = $_POST["password"];
$license_no = $_POST["license_no"];
$expiration_date = $_POST["expiration_date"];
$availability = (int)$_POST["availability"];



// Upload image
$uploadDir = dirname(__DIR__) . "/uploadsDriver/";
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

if (!isset($_FILES["picture"])) {
    echo json_encode([
        "success" => false,
        "message" => "No file received."
    ]);
    exit;
}

if ($_FILES["picture"]["error"] !== UPLOAD_ERR_OK) {
    echo json_encode([
        "success" => false,
        "message" => "Upload Error Code: " . $_FILES["picture"]["error"]
    ]);
    exit;
}

$imageName = time() . "_" . basename($_FILES["picture"]["name"]);
$targetFile = $uploadDir . $imageName;

if (!move_uploaded_file($_FILES["picture"]["tmp_name"], $targetFile)) {
    echo json_encode([
        "success" => false,
        "message" => "Could not move uploaded file.",
        "tmp_name" => $_FILES["picture"]["tmp_name"],
        "target" => realpath(dirname(__FILE__)) . "/" . $targetFile,
        "uploadDirExists" => file_exists($uploadDir),
        "uploadDirWritable" => is_writable($uploadDir),
        "error" => error_get_last()
    ]);
    exit;
}

// Save the relative path
$picture = "uploadsDriver/" . $imageName;
// Insert user
$sql = "INSERT INTO DriverTable
(username, password, license_no, expiration_date, picture, availability)
VALUES (?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "success" => false,
        "message" => $conn->error
    ]);
    exit;
}

$stmt->bind_param(
    "ssssss",
    $username,
    $password,
    $license_no,
    $expiration_date,
    $picture,
    $availability
);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "User added successfully."
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => $stmt->error
    ]);
}

$stmt->close();
$conn->close();