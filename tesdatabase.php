<?php
require_once __DIR__ . '/database.php';

try {
    $pdo = getAppDBConnection();
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM projects");
    $result = $stmt->fetch();
    echo "<!-- Jumlah project: {$result['total']} -->";
} catch (Exception $e) {
    die("Koneksi database gagal: " . $e->getMessage());
}
?>