<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "../db.php";

$data = json_decode(file_get_contents('php://input'), true);

$election_id = intval($data['election_id'] ?? 0);
$name = trim($data['name'] ?? '');

if ($election_id <= 0 || !$name) {
    echo json_encode(["success" => false, "message" => "Invalid data"]);
    exit;
}

$sql = "INSERT INTO candidates (election_id, name) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $election_id, $name);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Candidate added"]);
} else {
    echo json_encode(["success" => false, "message" => "Database error"]);
}

$stmt->close();
$conn->close();
?>
