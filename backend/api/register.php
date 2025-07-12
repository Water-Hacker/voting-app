<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "../db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email'], $data['password'], $data['nin'])) {
    echo json_encode(["success" => false, "message" => "Email, password, and NIN are required"]);
    exit;
}

$email = trim($data['email']);
$password = $data['password'];
$nin = trim($data['nin']);

// Check if NIN exists and get email and used status
$stmt = $conn->prepare("SELECT email, used FROM nins WHERE nin = ?");
$stmt->bind_param("s", $nin);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Invalid NIN"]);
    exit;
}

$row = $result->fetch_assoc();

if ($row['used']) {
    echo json_encode(["success" => false, "message" => "This NIN has already been used"]);
    exit;
}

if (strcasecmp($email, $row['email']) !== 0) {
    echo json_encode(["success" => false, "message" => "Email does not match the email registered with this NIN"]);
    exit;
}

// Check if email already registered
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$resultUser = $stmt->get_result();

if ($resultUser->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Email is already registered"]);
    exit;
}

// Hash password
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Insert new user
$stmt = $conn->prepare("INSERT INTO users (email, password, role) VALUES (?, ?, 'voter')");
$stmt->bind_param("ss", $email, $hashed_password);

if ($stmt->execute()) {
    // Mark NIN as used
    $stmt = $conn->prepare("UPDATE nins SET used = 1 WHERE nin = ?");
    $stmt->bind_param("s", $nin);
    $stmt->execute();

    echo json_encode(["success" => true, "message" => "Registration successful"]);
} else {
    echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
}

$stmt->close();
$conn->close();
?>
