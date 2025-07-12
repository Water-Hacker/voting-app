<?php
// Allow React frontend access
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "../db.php";

// Parse incoming JSON
$data = json_decode(file_get_contents('php://input'), true);

// Clean + extract inputs
$title = trim($data['title'] ?? '');
$description = trim($data['description'] ?? '');
$start_date = $data['start_date'] ?? '';
$end_date = $data['end_date'] ?? '';

// Validation checks
if (!$title || !$start_date || !$end_date) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

if (strtotime($start_date) >= strtotime($end_date)) {
    echo json_encode(["success" => false, "message" => "End date must be after start date"]);
    exit;
}

// Insert into DB
$sql = "INSERT INTO elections (title, description, start_date, end_date) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $title, $description, $start_date, $end_date);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Election created"]);
} else {
    echo json_encode(["success" => false, "message" => "Database error"]);
}

$stmt->close();
$conn->close();
?>
