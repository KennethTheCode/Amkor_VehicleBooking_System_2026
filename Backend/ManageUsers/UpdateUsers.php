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

// Required fields
if (
    !isset($_POST["user_id"]) ||
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

$id = intval($_POST["user_id"]);
$username = trim($_POST["username"]);
$password = $_POST["password"];
$contact_number = trim($_POST["contact_number"]);
$account_type = $_POST["account_type"];

if ($id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid user ID."
    ]);
    exit;
}

if ($username === "" || $password === "" || $contact_number === "" || $account_type === "") {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required."
    ]);
    exit;
}

$uploadDir = "../uploads/";
$newPicture = null; // stays null if no new picture uploaded

// --- Handle optional new picture upload ---
if (isset($_FILES["picture"]) && $_FILES["picture"]["error"] !== UPLOAD_ERR_NO_FILE) {

    if ($_FILES["picture"]["error"] !== UPLOAD_ERR_OK) {
        $uploadErrors = [
            UPLOAD_ERR_INI_SIZE   => "File is larger than the server allows (upload_max_filesize).",
            UPLOAD_ERR_FORM_SIZE  => "File is larger than the form allows.",
            UPLOAD_ERR_PARTIAL    => "File was only partially uploaded. Please try again.",
            UPLOAD_ERR_NO_TMP_DIR => "Server is missing a temporary folder for uploads.",
            UPLOAD_ERR_CANT_WRITE => "Server could not write the file to disk.",
            UPLOAD_ERR_EXTENSION  => "A server extension stopped the file upload.",
        ];
        $message = $uploadErrors[$_FILES["picture"]["error"]] ?? "Unknown upload error.";
        echo json_encode(["success" => false, "message" => $message]);
        exit;
    }

    if (!is_uploaded_file($_FILES["picture"]["tmp_name"])) {
        echo json_encode(["success" => false, "message" => "Invalid upload request."]);
        exit;
    }

    $allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    $fileType = mime_content_type($_FILES["picture"]["tmp_name"]);

    if (!in_array($fileType, $allowedTypes)) {
        echo json_encode(["success" => false, "message" => "Invalid file type. Only JPG, PNG, or WEBP allowed."]);
        exit;
    }

    $maxBytes = 5 * 1024 * 1024;
    if ($_FILES["picture"]["size"] > $maxBytes) {
        echo json_encode(["success" => false, "message" => "Picture must be smaller than 5MB."]);
        exit;
    }

    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    if (!is_writable($uploadDir)) {
        echo json_encode(["success" => false, "message" => "Upload directory is not writable."]);
        exit;
    }

    $imageName = time() . "_" . basename($_FILES["picture"]["name"]);
    $targetFile = $uploadDir . $imageName;

    if (!move_uploaded_file($_FILES["picture"]["tmp_name"], $targetFile)) {
        echo json_encode(["success" => false, "message" => "Could not save the uploaded file."]);
        exit;
    }

    $newPicture = "uploads/" . $imageName;
}

// --- Build the update query (only touches `picture` if a new one was uploaded) ---
if ($newPicture !== null) {
    $sql = "UPDATE UserTable
            SET username = ?, password = ?, contact_number = ?, account_type = ?, picture = ?
            WHERE user_id = ?";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(["success" => false, "message" => $conn->error]);
        exit;
    }

    $stmt->bind_param(
        "sssssi",
        $username,
        $password,
        $contact_number,
        $account_type,
        $newPicture,
        $id
    );
} else {
    $sql = "UPDATE UserTable
            SET username = ?, password = ?, contact_number = ?, account_type = ?
            WHERE user_id = ?";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(["success" => false, "message" => $conn->error]);
        exit;
    }

    $stmt->bind_param(
        "ssssi",
        $username,
        $password,
        $contact_number,
        $account_type,
        $id
    );
}

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "User updated successfully.",
        "picture" => $newPicture // null if unchanged, so frontend knows whether to update the image
    ]);
} else {
    if ($newPicture !== null) {
        unlink($uploadDir . basename($newPicture));
    }
    echo json_encode([
        "success" => false,
        "message" => $stmt->error
    ]);
}

$stmt->close();
$conn->close();