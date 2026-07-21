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
    !isset($_POST["username"]) ||
    !isset($_POST["password"]) ||
    !isset($_POST["contact_number"]) ||
    !isset($_POST["account_type"])
) {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required."
    ]);
    exit;
}

$username = trim($_POST["username"]);
$password = $_POST["password"];
$contact_number = $_POST["contact_number"];
$account_type = $_POST["account_type"];

if ($username === "" || $password === "" || $contact_number === "" || $account_type === "") {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required."
    ]);
    exit;
}

// --- File upload validation ---

if (!isset($_FILES["picture"]) || $_FILES["picture"]["error"] === UPLOAD_ERR_NO_FILE) {
    echo json_encode([
        "success" => false,
        "message" => "Please select a picture to upload."
    ]);
    exit;
}

if ($_FILES["picture"]["error"] !== UPLOAD_ERR_OK) {
    $uploadErrors = [
        UPLOAD_ERR_INI_SIZE   => "File is larger than the server allows (upload_max_filesize).",
        UPLOAD_ERR_FORM_SIZE  => "File is larger than the form allows.",
        UPLOAD_ERR_PARTIAL    => "File was only partially uploaded. Please try again.",
        UPLOAD_ERR_NO_TMP_DIR => "Server is missing a temporary folder for uploads.",
        UPLOAD_ERR_CANT_WRITE => "Server could not write the file to disk.",
        UPLOAD_ERR_EXTENSION  => "A server extension stopped the file upload.",
    ];

    $message = $uploadErrors[$_FILES["picture"]["error"]] ?? "Unknown upload error (code " . $_FILES["picture"]["error"] . ").";

    echo json_encode([
        "success" => false,
        "message" => $message
    ]);
    exit;
}

if (!is_uploaded_file($_FILES["picture"]["tmp_name"])) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid upload request."
    ]);
    exit;
}

$allowedTypes = ["image/jpeg", "image/png", "image/webp"];
$fileType = mime_content_type($_FILES["picture"]["tmp_name"]);

if ($fileType === false) {
    echo json_encode([
        "success" => false,
        "message" => "Could not read the uploaded file. It may be corrupted."
    ]);
    exit;
}

if (!in_array($fileType, $allowedTypes)) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid file type. Only JPG, PNG, or WEBP images are allowed."
    ]);
    exit;
}

$maxBytes = 5 * 1024 * 1024;
if ($_FILES["picture"]["size"] > $maxBytes) {
    echo json_encode([
        "success" => false,
        "message" => "Picture must be smaller than 5MB."
    ]);
    exit;
}

// --- Prepare upload directory ---
$uploadDir = "../uploads/";

if (!file_exists($uploadDir)) {
    if (!mkdir($uploadDir, 0777, true)) {
        echo json_encode([
            "success" => false,
            "message" => "Could not create upload directory on the server."
        ]);
        exit;
    }
}

if (!is_writable($uploadDir)) {
    echo json_encode([
        "success" => false,
        "message" => "Upload directory exists but is not writable by the server."
    ]);
    exit;
}

// --- Move the file ---
$imageName = time() . "_" . basename($_FILES["picture"]["name"]);
$targetFile = $uploadDir . $imageName;

if (!move_uploaded_file($_FILES["picture"]["tmp_name"], $targetFile)) {
    echo json_encode([
        "success" => false,
        "message" => "Could not save the uploaded file. Please try again."
    ]);
    exit;
}

$picture = "uploads/" . $imageName;
$status = "Active"; // matches UserTable.status column

// --- Insert user ---
$sql = "INSERT INTO UserTable
(username, password, contact_number ,account_type, picture, status)
VALUES (?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    unlink($targetFile); // clean up the saved file since we can't use it
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
    $contact_number,
    $account_type,
    $picture,
    $status
);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "User added successfully."
    ]);
} else {
    unlink($targetFile); // clean up the saved file since the row wasn't created
    echo json_encode([
        "success" => false,
        "message" => $stmt->error
    ]);
}

$stmt->close();
$conn->close();