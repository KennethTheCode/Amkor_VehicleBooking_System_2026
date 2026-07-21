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
    !isset($_POST["driver_id"]) ||
    !isset($_POST["username"]) ||
    !isset($_POST["password"]) ||
    !isset($_POST["email"]) ||
    !isset($_POST["license_no"]) ||
    !isset($_POST["expiration_date"])
) {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required."
    ]);
    exit;
}

$driver_id = intval($_POST["driver_id"]);
$username = trim($_POST["username"]);
$password = $_POST["password"];
$email = trim($_POST["email"]);
$license_no = trim($_POST["license_no"]);
$expiration_date = $_POST["expiration_date"];

if (
    $driver_id <= 0 ||
    $username === "" ||
    $password === "" ||
    $email === "" ||
    $license_no === "" ||
    $expiration_date === ""
) {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required."
    ]);
    exit;
}

// --- Look up the existing driver (needed to clean up old picture if replaced) ---
$lookup = $conn->prepare("SELECT picture FROM DriverTable WHERE id = ?");
$lookup->bind_param("i", $driver_id);
$lookup->execute();
$result = $lookup->get_result();

if ($result->num_rows === 0) {
    $lookup->close();
    echo json_encode([
        "success" => false,
        "message" => "Driver not found."
    ]);
    exit;
}

$existingDriver = $result->fetch_assoc();
$lookup->close();

$picture = $existingDriver["picture"];
$newPictureSaved = false;

// --- Handle optional picture replacement ---
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

    if ($fileType === false || !in_array($fileType, $allowedTypes)) {
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

    $uploadDir = dirname(__DIR__) . "/uploadsDriver/";

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

    $imageName = time() . "_" . basename($_FILES["picture"]["name"]);
    $targetFile = $uploadDir . $imageName;

    if (!move_uploaded_file($_FILES["picture"]["tmp_name"], $targetFile)) {
        echo json_encode([
            "success" => false,
            "message" => "Could not save the uploaded file. Please try again."
        ]);
        exit;
    }

    $newPictureSaved = true;
    $oldPicturePath = dirname(__DIR__) . "/" . $picture;
    $picture = "uploadsDriver/" . $imageName;
}

// --- Update driver ---
$sql = "UPDATE DriverTable
SET username = ?, password = ?, email = ?, license_no = ?, expiration_date = ?, picture = ?
WHERE id = ?";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    if ($newPictureSaved && file_exists($targetFile)) {
        unlink($targetFile);
    }
    echo json_encode([
        "success" => false,
        "message" => $conn->error
    ]);
    exit;
}

$stmt->bind_param(
    "ssssssi",
    $username,
    $password,
    $email,
    $license_no,
    $expiration_date,
    $picture,
    $driver_id
);

if ($stmt->execute()) {
    // Clean up the old picture file now that the new one is confirmed saved
    if ($newPictureSaved && isset($oldPicturePath) && file_exists($oldPicturePath)) {
        unlink($oldPicturePath);
    }

    $response = [
        "success" => true,
        "message" => "Driver updated successfully."
    ];

    if ($newPictureSaved) {
        $response["picture"] = $picture;
    }

    echo json_encode($response);
} else {
    if ($newPictureSaved && file_exists($targetFile)) {
        unlink($targetFile);
    }
    echo json_encode([
        "success" => false,
        "message" => $stmt->error
    ]);
}

$stmt->close();
$conn->close();