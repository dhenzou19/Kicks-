<?php
$servername = "127.0.0.1";
$username = "root";
$password = "";
$database = "pos";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$database", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $category = $_GET['category'] ?? 'all';
    
    if ($category === 'all') {
        $stmt = $conn->prepare("SELECT * FROM stock");
        $stmt->execute();
    } else {
        $stmt = $conn->prepare("SELECT * FROM stock WHERE category = ?");
        $stmt->execute([$category]);
    }
    
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($products);
    
} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
