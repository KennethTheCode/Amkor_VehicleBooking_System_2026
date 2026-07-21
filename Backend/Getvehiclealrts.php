<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include "db.php";

// Thresholds
$BALANCE_THRESHOLD = 1000;   // alert when rfid_balance <= this
$DAYS_THRESHOLD     = 15;    // alert when expiration is within this many days

$sql = "
    SELECT
        id,
        vehicle_model,
        rfid_balance,
        expiration,
        DATEDIFF(expiration, CURDATE()) AS days_left
    FROM VehicleTable
    WHERE
        rfid_balance < ?
        OR expiration <= DATE_ADD(CURDATE(), INTERVAL ? DAY)
";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "success" => false,
        "message" => $conn->error
    ]);
    exit;
}

$stmt->bind_param("ii", $BALANCE_THRESHOLD, $DAYS_THRESHOLD);
$stmt->execute();
$result = $stmt->get_result();

$alerts = [];

while ($row = $result->fetch_assoc()) {

    // Low balance alert
    if ($row["rfid_balance"] < $BALANCE_THRESHOLD) {
        $alerts[] = [
            "id"            => (int)$row["id"],
            "vehicle_model" => $row["vehicle_model"],
            "type"          => "balance",
            "message"       => "RFID balance is low (₱" . number_format($row["rfid_balance"], 2) . " remaining)"
        ];
    }

    // Expiration alert (covers both "already expired" and "expiring soon")
    if ($row["days_left"] !== null && $row["days_left"] <= $DAYS_THRESHOLD) {
        if ($row["days_left"] < 0) {
            $message = "Registration expired on " . $row["expiration"];
        } elseif ($row["days_left"] == 0) {
            $message = "Registration expires today (" . $row["expiration"] . ")";
        } else {
            $message = "Registration expires in {$row['days_left']} day"
                . ($row["days_left"] == 1 ? "" : "s")
                . " (" . $row["expiration"] . ")";
        }

        $alerts[] = [
            "id"            => (int)$row["id"],
            "vehicle_model" => $row["vehicle_model"],
            "type"          => "expiration",
            "message"       => $message
        ];
    }
}

echo json_encode([
    "success" => true,
    "alerts" => $alerts
]);

$conn->close();