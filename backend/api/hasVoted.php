<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "../db.php";

$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;
$election_id = isset($_GET['election_id']) ? intval($_GET['election_id']) : 0;

if (!$user_id || !$election_id) {
    echo json_encode(["success" => false, "message" => "Missing user_id or election_id"]);
    exit;
}

$sql = "SELECT id FROM votes WHERE user_id = ? AND election_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $user_id, $election_id);
$stmt->execute();
$result = $stmt->get_result();

echo json_encode([
    "success" => true,
    "hasVoted" => $result->num_rows > 0
]);

$stmt->close();
$conn->close();
?>
