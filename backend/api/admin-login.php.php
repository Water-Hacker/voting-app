<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'];
$password = $data['password'];
$nin = $data['nin'];

$sql = "SELECT * FROM users WHERE email = ? AND password = ? AND nin = ? AND role = 'admin'";
$stmt = $pdo->prepare($sql);
$stmt->execute([$email, $password, $nin]);

if ($stmt->rowCount() > 0) {
    echo json_encode(["success" => true, "message" => "Admin login successful."]);
} else {
    echo json_encode(["success" => false, "message" => "Invalid admin credentials."]);
}
?>
