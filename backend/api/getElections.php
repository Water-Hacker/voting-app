<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "../db.php";

// Get current datetime
$now = date("Y-m-d H:i:s");

// Select elections that are currently active
$sql = "SELECT id, title, description, start_date, end_date 
        FROM elections 
        WHERE start_date <= '$now' AND end_date >= '$now'";

$result = $conn->query($sql);

$elections = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $elections[] = $row;
    }
}

echo json_encode(["success" => true, "elections" => $elections]);

$conn->close();
?>
