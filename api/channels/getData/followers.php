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

    // Get channel followers (последняя запись)
    $stmt = $pdo->prepare('SELECT followers FROM channels_folowers WHERE channel_id = :channel_id ORDER BY created_at DESC LIMIT 1');
    $stmt->bindValue(':channel_id', $channel_id, PDO::PARAM_INT);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if (empty($result) || !isset($result['followers'])) {
        http_response_code(404);
        echo json_encode([
            'status' => false,
            'error' => 'Bad request',
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    // Декодируем JSON поле followers
    $followersData = json_decode($result['followers'], true);
    
    if (json_last_error() !== JSON_ERROR_NONE || !is_array($followersData)) {
        http_response_code(500);
        echo json_encode([
            'status' => false,
            'error' => 'Bad request',
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    // Преобразуем данные в формат [{ x: timestamp, y: participants_count }]
    $formattedData = [];
    
    foreach ($followersData as $item) {
        if (!is_array($item) || !isset($item['period']) || !isset($item['participants_count'])) {
            continue;
        }

        $period = $item['period'];
        $participantsCount = (int)$item['participants_count'];

        // Преобразуем period в timestamp
        // Поддерживаем форматы: YYYY-MM-DD и YYYY-MM-DD HH:MM
        $timestamp = strtotime($period);
        if ($timestamp === false) {
            continue; // Пропускаем невалидные даты
        }

        $formattedData[] = [
            'x' => $timestamp * 1000,
            'y' => $participantsCount,
        ];
    }

    // Возвращаем только массив данных
    echo json_encode([
        'status' => true,
        'data' => $formattedData,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'status' => false,
        'error' => 'Internal server error'
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

