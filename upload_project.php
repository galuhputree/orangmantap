
<?php
require_once __DIR__ . '/database.php';

header('Content-Type: application/json');

try {
    $pdo = getAppDBConnection();

    // Ambil data dari form
    $problem     = $_POST['problem'] ?? '';
    $solution    = $_POST['title'] ?? ''; // ⬅️ FIX DI SINI
    $methodology = $_POST['methodology'] ?? '';
    $skills      = $_POST['skills'] ?? '';
    $result      = $_POST['result'] ?? '';
    $impact      = $_POST['impact'] ?? '';

    if (empty($problem) || empty($solution)) {
        throw new Exception('Problem dan Solution wajib diisi.');
    }

    // Gunakan solution sebagai title/preview text
    $documentation = null;
    
    // 🔥 CEK MODE EDIT ATAU TAMBAH
$projectId = $_POST['id'] ?? null;
$editMode  = isset($_POST['editMode']) && $_POST['editMode'] === 'true';

if ($editMode && $projectId) {
    // 🔄 UPDATE PROJECT
    $stmt = $pdo->prepare("
        UPDATE projects 
        SET problem=?, title=?, methodology=?, skills=?, result=?, impact=?
        WHERE id=?
    ");
    $stmt->execute([
        $problem,
        $solution,
        $methodology,
        $skills,
        $result,
        $impact,
        $projectId
    ]);
} else {
    // ➕ INSERT PROJECT BARU
    $stmt = $pdo->prepare("
        INSERT INTO projects (problem, title, methodology, skills, result, impact, documentation)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $problem,
        $solution,
        $methodology,
        $skills,
        $result,
        $impact,
        null
    ]);

    $projectId = $pdo->lastInsertId();
}

    // Folder upload
    $uploadDir = __DIR__ . '/uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // Proses file yang diupload
    if (!empty($_FILES['images']['name'][0])) {
        foreach ($_FILES['images']['tmp_name'] as $index => $tmpName) {
            $fileName = time() . '_' . basename($_FILES['images']['name'][$index]);
            $filePath = $uploadDir . $fileName;

            if (move_uploaded_file($tmpName, $filePath)) {
                // cek apakah sudah punya preview
                $stmt = $pdo->prepare("SELECT COUNT(*) FROM project_files WHERE project_id = ? AND is_preview = 1");
                $stmt->execute([$projectId]);
                $hasPreview = $stmt->fetchColumn() > 0;

// kalau belum ada preview → baru set
$isPreview = !$hasPreview && $index === 0;

                if ($isPreview) {
                    $pdo->prepare("
                        UPDATE projects SET documentation = ?
                        WHERE id = ?
                    ")->execute(['uploads/' . $fileName, $projectId]);
                }

                $pdo->prepare("
                    INSERT INTO project_files (project_id, file_name, file_path, file_type, is_preview)
                    VALUES (?, ?, ?, ?, ?)
                ")->execute([
                    $projectId,
                    $fileName,
                    'uploads/' . $fileName,
                    $_FILES['images']['type'][$index],
                    $isPreview
                ]);
            }
        }
    }

        echo json_encode([
        'success' => true,
        'message' => 'Project berhasil disimpan.',
        'projectId' => $projectId
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}