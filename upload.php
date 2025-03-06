<?php
// Database connection
$servername = "127.0.0.1";
$username = "root";
$password = "";
$database = "pos";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$database", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Handle file upload
    if(isset($_FILES['image'])) {
        $file = $_FILES['image'];
        $fileName = time() . '_' . basename($file['name']);
        $targetDir = "uploads/";
        $targetPath = $targetDir . $fileName;
        
        // Create uploads directory if it doesn't exist
        if (!file_exists($targetDir)) {
            mkdir($targetDir, 0777, true);
        }
        
        // Move uploaded file
        if(move_uploaded_file($file['tmp_name'], $targetPath)) {
            // Prepare and execute SQL statement
            $stmt = $conn->prepare("INSERT INTO stock (category, name, price, image_path) VALUES (?, ?, ?, ?)");
            $stmt->execute([
                $_POST['category'],
                $_POST['name'],
                $_POST['price'],
                $targetPath
            ]);
            
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to upload image'
            ]);
        }
    }
} catch(PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}