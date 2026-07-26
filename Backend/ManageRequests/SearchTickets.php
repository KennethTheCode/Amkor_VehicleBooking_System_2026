<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "../db.php";

if (!isset($conn) || $conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed.',
    ]);
    exit();
}

$search = isset($_GET['q']) ? trim($_GET['q']) : '';

if ($search === '') {
    echo json_encode([]);
    exit();
}

$like = '%' . $search . '%';

$stmt = $conn->prepare(
    "SELECT * FROM `FinishedTicket` WHERE ticket_id LIKE ?
    OR pick_up LIKE ?
    OR drop_off LIKE ?
     ORDER BY ticket_id DESC"
);

if (!$stmt) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to prepare search query: ' . $conn->error,
    ]);
    exit();
}

$stmt->bind_param('sss', $like, $like, $like);

if (!$stmt->execute()) {
    $error = $stmt->error;
    $stmt->close();
    $conn->close();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Search failed: ' . $error,
    ]);
    exit();
}

$result = $stmt->get_result();

$rows = [];
while ($row = $result->fetch_assoc()) {
    $rows[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode($rows);