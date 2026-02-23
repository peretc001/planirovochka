<?php
declare(strict_types=1);

require __DIR__ . '/../../db.php';

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

header('Content-Type: application/json');

// Accept both GET and POST inputs
$input = $_SERVER['REQUEST_METHOD'] === 'POST'
    ? (json_decode(file_get_contents('php://input') ?: '', true) ?? [])
    : $_GET;

$channel_id = isset($input['channel_id']) ? (int)$input['channel_id'] : 0;
$hash = isset($input['hash']) ? trim((string)$input['hash']) : '';

if ($channel_id === 0 || $hash !== 'f38e8c02a69ac54996688c8830533') {
    http_response_code(422);
    echo json_encode([
        'status' => false,
        'error' => 'Bad request',
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

try {
    $pdo = getPdoConnection();

    // Get channel statistics
    $stmt = $pdo->prepare('SELECT * FROM channel_statistics WHERE channel_id = :channel_id');
    $stmt->bindValue(':channel_id', $channel_id, PDO::PARAM_INT);
    $stmt->execute();
    $statistics = $stmt->fetch(PDO::FETCH_ASSOC);

    if (empty($statistics)) {
        http_response_code(404);
        echo json_encode([
            'status' => false,
            'error' => 'Channel not found',
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    echo json_encode([
        'status' => true,
        'data' => $statistics,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'status' => false,
        'error' => 'Internal server error'
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
