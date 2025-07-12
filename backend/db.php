<?php
$host = "localhost";        // Hostname (XAMPP runs MySQL locally)
$user = "root";             // Default XAMPP username
$password = "";             // Default password is empty
$dbname = "voting_app";     // Make sure this matches your database name

// Create connection
$conn = new mysqli($host, $user, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
