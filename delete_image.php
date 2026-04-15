<?php
require_once __DIR__ . '/database.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);
$imagePath = $data['path'] ?? '';

try {
    $pdo = getAppDBConnection();

    if (!$imagePath) {
        throw new Exception("Path kosong");
    }

    // Hapus dari database
    $stmt = $pdo->prepare("DELETE FROM project_files WHERE file_path = ?");
    $stmt->execute([$imagePath]);

    // Hapus file dari folder
    $fullPath = __DIR__ . '/' . $imagePath;
    if (file_exists($fullPath)) {
        unlink($fullPath);
    }

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}