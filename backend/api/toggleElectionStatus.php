<?php
header("Content-Type: application/json");
require_once "../db.php";

$data = json_decode(file_get_contents('php://input'), true);

$election_id = intval($data['election_id'] ?? 0);
$status = intval($data['status'] ?? 1); // 1 = active, 0 = inactive

if ($election_id <= 0) {
    echo json_encode(["success" => false, "message" => "Invalid election ID"]);
    exit;
}

$sql = "UPDATE elections SET is_active = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $status, $election_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Election status updated"]);
} else {
    echo json_encode(["success" => false, "message" => "Database error"]);
}

$stmt->close();
$conn->close();
?>
