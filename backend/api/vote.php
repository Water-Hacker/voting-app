<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "../db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['user_id'], $data['election_id'], $data['candidate_id'])) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

$user_id = intval($data['user_id']);
$election_id = intval($data['election_id']);
$candidate_id = intval($data['candidate_id']);

// Debug: log incoming data
error_log("vote.php called with user_id = $user_id, election_id = $election_id, candidate_id = $candidate_id");

// Check if user exists
$sqlCheckUser = "SELECT id FROM users WHERE id = ?";
$stmtUser = $conn->prepare($sqlCheckUser);
$stmtUser->bind_param("i", $user_id);
$stmtUser->execute();
$resultUser = $stmtUser->get_result();

if ($resultUser->num_rows == 0) {
    error_log("User with id $user_id not found in DB");
    echo json_encode(["success" => false, "message" => "User not found"]);
    exit;
}

// Check if user has already voted in this election
$sqlCheckVote = "SELECT * FROM votes WHERE user_id = ? AND election_id = ?";
$stmtCheckVote = $conn->prepare($sqlCheckVote);
$stmtCheckVote->bind_param("ii", $user_id, $election_id);
$stmtCheckVote->execute();
$resultCheckVote = $stmtCheckVote->get_result();

if ($resultCheckVote->num_rows > 0) {
    error_log("User with id $user_id already voted in election $election_id");
    echo json_encode(["success" => false, "message" => "You already voted in this election"]);
    exit;
}

$conn->begin_transaction();

try {
    // Update candidate votes
    $sqlUpdateVotes = "UPDATE candidates SET votes = votes + 1 WHERE id = ? AND election_id = ?";
    $stmtUpdateVotes = $conn->prepare($sqlUpdateVotes);
    $stmtUpdateVotes->bind_param("ii", $candidate_id, $election_id);
    if (!$stmtUpdateVotes->execute()) {
        throw new Exception("Failed to update candidate votes");
    }

    // Insert vote record
    $sqlInsertVote = "INSERT INTO votes (user_id, election_id, candidate_id) VALUES (?, ?, ?)";
    $stmtInsertVote = $conn->prepare($sqlInsertVote);
    $stmtInsertVote->bind_param("iii", $user_id, $election_id, $candidate_id);
    if (!$stmtInsertVote->execute()) {
        throw new Exception("Failed to record vote");
    }

    $conn->commit();

    echo json_encode(["success" => true, "message" => "Vote recorded successfully"]);
} catch (Exception $e) {
    $conn->rollback();
    error_log("Transaction error: " . $e->getMessage());
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

$stmtUser->close();
$stmtCheckVote->close();
$stmtUpdateVotes->close();
$stmtInsertVote->close();
$conn->close();
?>
