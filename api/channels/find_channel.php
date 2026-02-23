<?php

declare(strict_types=1);

require __DIR__ . '/../db.php';

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

header('Content-Type: application/json');

// TODO: переписать на пост
try {
    $pdo = getPdoConnection();

    $slug = isset($_GET['slug']) ? (string)$_GET['slug'] : null;
    $hash = isset($_GET['hash']) ? trim((string)$_GET['hash']) : '';

    // Validation
    if ($slug === '' || $hash !== 'f38e8c02a69ac54996688c8830533') {
        http_response_code(422);
        echo json_encode([
            'status' => false,
            'error' => 'Bad request',
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    $stmt = $pdo->prepare('SELECT * FROM channels WHERE username = :slug');
    $stmt->bindValue(':slug', urldecode($slug), PDO::PARAM_STR);
    $stmt->execute();
    $row = $stmt->fetch();

    if (!$row) {
        http_response_code(404);
        echo json_encode(['status' => false, 'error' => 'Channel not found']);
        exit;
    }

    echo json_encode(['status' => true, 'data' => $row], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PARTIAL_OUTPUT_ON_ERROR);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['status' => false, 'error' => $e->getMessage()], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PARTIAL_OUTPUT_ON_ERROR);
}



