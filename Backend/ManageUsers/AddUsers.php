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
    !isset($_POST["account_type"]) ||
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
$account_type = $_POST["account_type"];

// Upload image
$uploadDir = "../uploads/";

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
$picture = "uploads/" . $imageName;
// Insert user
$sql = "INSERT INTO UserTable
(username, password, account_type, picture)
VALUES (?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "success" => false,
        "message" => $conn->error
    ]);
    exit;
}

$stmt->bind_param(
    "ssss",
    $username,
    $password,
    $account_type,
    $picture
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