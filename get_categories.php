<?php
$servername = "127.0.0.1";
$username = "root";
$password = "";
$database = "pos";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$database", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Get distinct categories
    $stmt = $conn->prepare("SELECT DISTINCT category FROM stock");
    $stmt->execute();
    
    // Fetch as array
    $categories = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo json_encode($categories);
    
} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
