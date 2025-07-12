<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
require_once "../db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email'], $data['password'], $data['nin'])) {
    echo json_encode(["success" => false, "message" => "All fields required"]);
    exit;
}

$email = trim($data['email']);
$password = $data['password'];
$nin = trim($data['nin']);

// Validate email and NIN
if (!preg_match('/^[^\s@]+@[^\s@]+\.cgov$/i', $email) || !preg_match('/^\d{3}$/', $nin)) {
    echo json_encode(["success" => false, "message" => "Invalid email or NIN"]);
    exit;
}

// ✅ Try Admin login
$stmt = $conn->prepare("SELECT id, password FROM admins WHERE email = ? AND nin = ?");
$stmt->bind_param("ss", $email, $nin);
$stmt->execute();
$adminResult = $stmt->get_result();

if ($adminResult->num_rows > 0) {
    $admin = $adminResult->fetch_assoc();
    if (password_verify($password, $admin['password'])) {
        echo json_encode([
            "success" => true,
            "message" => "Admin login successful",
            "user" => [
                "id" => $admin['id'],
                "email" => $email,
                "role" => "admin",
                "isAdmin" => true
            ]
        ]);
        exit;
    }
}

// ✅ Try Regular User login
$stmt = $conn->prepare("
    SELECT u.id, u.password, u.role, u.has_voted 
    FROM users u 
    WHERE u.email = ? 
    AND EXISTS (SELECT 1 FROM nins WHERE email = ? AND nin = ?)
");
$stmt->bind_param("sss", $email, $email, $nin);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Invalid credentials"]);
    exit;
}

$user = $result->fetch_assoc();
if (!password_verify($password, $user['password'])) {
    echo json_encode(["success" => false, "message" => "Invalid password"]);
    exit;
}

echo json_encode([
    "success" => true,
    "message" => "User login successful",
    "user" => [
        "id" => $user['id'],
        "email" => $email,
        "role" => $user['role'],
        "has_voted" => (bool)$user['has_voted'],
        "isAdmin" => false
    ]
]);
$conn->close();
