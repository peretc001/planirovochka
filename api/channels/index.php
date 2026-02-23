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

$rawBody = file_get_contents('php://input') ?: '';
$input = json_decode($rawBody, true);

$hash = isset($input['hash']) ? trim((string)$input['hash']) : '';
$id = isset($input['id']) ? (int)$input['id'] : 0;

if ($owner_id === 0 || $hash !== 'f38e8c02a69ac54996688c8830533') {
    http_response_code(422);
    echo json_encode([
        'status' => false,
        'error' => 'Bad request',
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

try {
    $pdo = getPdoConnection();

    $stmt = $pdo->prepare('SELECT * FROM users WHERE id = :id ORDER BY updated_at desc');
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    $result = $stmt->fetchAll();

    if (empty($result)) {
        http_response_code(404);
        echo json_encode([
            'status' => false,
            'error' => 'Users not found',
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    echo json_encode([
        'status' => true,
        'data' => $result,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['status' => false, 'error' => $e->getMessage()], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PARTIAL_OUTPUT_ON_ERROR);
}



