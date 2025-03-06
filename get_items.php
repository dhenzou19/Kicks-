<?php
$servername = "127.0.0.1";
$username = "root";
$password = "";
$database = "pos";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$category = isset($_GET['category']) ? $_GET['category'] : '';

$sql = "SELECT id, name, price, image_path FROM stock";
if (!empty($category)) {
    $sql .= " WHERE category = '" . $conn->real_escape_string($category) . "'";
}

$result = $conn->query($sql);

$items = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $items[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode($items);

$conn->close();
?>