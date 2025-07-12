<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "../db.php";

$election_id = isset($_GET['election_id']) ? intval($_GET['election_id']) : 0;

if ($election_id <= 0) {
    echo json_encode(["success" => false, "message" => "Invalid election ID"]);
    exit;
}

$sql = "SELECT id, name, votes, created_at FROM candidates WHERE election_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $election_id);
$stmt->execute();
$result = $stmt->get_result();

$candidates = [];
while ($row = $result->fetch_assoc()) {
    $candidates[] = $row;
}

echo json_encode(["success" => true, "candidates" => $candidates]);

$stmt->close();
$conn->close();
?>
