
<?php
header("Content-Type: application/json");
$conn = new mysqli("localhost", "root", "", "website");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// ================= GET (AMBIL KOMENTAR) =================
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $conn->query("SELECT name, message, created_at FROM comments ORDER BY id DESC");
    
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode($data);
    exit;
}

// ================= POST (TAMBAH KOMENTAR) =================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // ambil data JSON
    $input = json_decode(file_get_contents("php://input"), true);

    $name = $conn->real_escape_string($input['name'] ?? '');
    $email = $conn->real_escape_string($input['email'] ?? '');
    $message = $conn->real_escape_string($input['message'] ?? '');

    if ($name && $message) {
        $sql = "INSERT INTO comments (name, email, message) VALUES ('$name', '$email', '$message')";
        
        if ($conn->query($sql)) {
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "error", "msg" => $conn->error]);
        }
    } else {
        echo json_encode(["status" => "error", "msg" => "Data kosong"]);
    }

    exit;
}
?>