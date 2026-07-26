<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include "../db.php";

$ticket_id = isset($_GET['ticket_id']) ? $_GET['ticket_id'] : null;

$sql = "
SELECT
    BookingTable.ticket_id,
    BookingTable.user_id,
    BookingTable.driver_id,

    UserTable.username,
    UserTable.email AS user_email,

    DriverTable.username AS driver_username,
    DriverTable.email AS driver_email,

    VehicleTable.id AS vehicle_id,
    VehicleTable.vehicle_model,
    VehicleTable.image,

    GROUP_CONCAT(PassengerTable.passengers SEPARATOR ', ') AS passengers,

    BookingTable.pick_up,
    BookingTable.drop_off,
    BookingTable.purpose,
    BookingTable.date_needed,
    BookingTable.time_needed,
    BookingTable.status,
    BookingTable.created_at,

    FinishedTicket.pick_up AS pick_up_final,
    FinishedTicket.drop_off AS drop_off_final,
    FinishedTicket.finished_id,
    FinishedTicket.beginning,
    FinishedTicket.ending,
    (FinishedTicket.ending - FinishedTicket.beginning) AS distance_travelled,
    FinishedTicket.time_out,
    FinishedTicket.time_in,
    FinishedTicket.date_finished,
    FinishedTicket.rfid_balance

FROM BookingTable

INNER JOIN UserTable
    ON BookingTable.user_id = UserTable.user_id

INNER JOIN VehicleTable
    ON BookingTable.vehicle_id = VehicleTable.id

LEFT JOIN DriverTable
    ON BookingTable.driver_id = DriverTable.id

LEFT JOIN PassengerTable
    ON BookingTable.ticket_id = PassengerTable.ticket_id

LEFT JOIN FinishedTicket
    ON BookingTable.ticket_id = FinishedTicket.ticket_id
";

$params = [];
$types = "";

if ($ticket_id !== null) {
    $sql .= " WHERE BookingTable.ticket_id = ? ";
    $types .= "i";
    $params[] = $ticket_id;
}

$sql .= "
GROUP BY
    BookingTable.ticket_id,
    BookingTable.user_id,
    BookingTable.driver_id,

    UserTable.username,
    UserTable.email,

    DriverTable.username,
    DriverTable.email,

    VehicleTable.id,
    VehicleTable.vehicle_model,
    VehicleTable.image,

    BookingTable.pick_up,
    BookingTable.drop_off,
    BookingTable.purpose,
    BookingTable.date_needed,
    BookingTable.time_needed,
    BookingTable.status,
    BookingTable.created_at,

    FinishedTicket.finished_id,
    FinishedTicket.beginning,
    FinishedTicket.ending,
    FinishedTicket.time_out,
    FinishedTicket.time_in,
    FinishedTicket.date_finished,
    FinishedTicket.rfid_balance

ORDER BY BookingTable.created_at ASC
";

// Using a prepared statement here (instead of $conn->query directly like the
// reference file) since ticket_id can come from user input via $_GET —
// this avoids SQL injection when the filter is used.
if ($ticket_id !== null) {
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(["success" => false, "message" => $conn->error]);
        exit;
    }
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    $result = $conn->query($sql);
}

if (!$result) {
    echo json_encode([
        "success" => false,
        "message" => $conn->error
    ]);
    exit;
}

$tickets = [];

while ($row = $result->fetch_assoc()) {

    $tickets[] = [
        "ticket_id"       => $row["ticket_id"],
        "user_id"         => $row["user_id"],
        "driver_id"       => $row["driver_id"],

        "username"        => $row["username"],
        "user_email"      => $row["user_email"],

        "driver_username" => $row["driver_username"],
        "driver_email"    => $row["driver_email"],

        "vehicle_id"      => $row["vehicle_id"],
        "vehicle_model"   => $row["vehicle_model"],
        "image"           => $row["image"],

        "passengers"      => $row["passengers"],

        "pick_up"         => $row["pick_up"],
        "drop_off"        => $row["drop_off"],
        "purpose"         => $row["purpose"],
        "date_needed"     => $row["date_needed"],
        "time_needed"     => $row["time_needed"],
        "status"          => $row["status"],
        "created_at"      => $row["created_at"],
        "pick_up_final"   => $row["pick_up_final"],
        "drop_off_final"      => $row["drop_off_final"],
        "finished_id"         => $row["finished_id"],
        "beginning"           => $row["beginning"],
        "ending"              => $row["ending"],
        "distance_travelled"  => $row["distance_travelled"],
        "time_out"            => $row["time_out"],
        "time_in"             => $row["time_in"],
        "date_finished"       => $row["date_finished"],
        "rfid_balance"        => $row["rfid_balance"]
    ];
}

echo json_encode($tickets);

$conn->close();