<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/db.php';
require_once __DIR__ . '/TgStatSubscribers.php';

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

$channelId = isset($input['channelId']) ? trim((string)$input['channelId']) : '';
$hash = isset($input['hash']) ? trim((string)$input['hash']) : '';

// Validation
if ($hash !== 'f38e8c02a69ac54996688c8830533') {
    http_response_code(422);
    echo json_encode([
        'status' => false,
        'error' => 'Bad request',
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

// Если channelId не передан, пытаемся получить из file_get_contents
if ($channelId === '') {
    // Можно указать путь к файлу с channelId
    $channelIdFile = isset($input['channelIdFile']) ? (string)$input['channelIdFile'] : null;
    if ($channelIdFile && file_exists($channelIdFile)) {
        $channelId = trim(file_get_contents($channelIdFile));
    }
}

if ($channelId === '') {
    http_response_code(422);
    echo json_encode([
        'status' => false,
        'error' => 'Parameter "channelId" is required',
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

try {
    $service = new TgStatSubscribers();
    $result = $service->getHourlySubscribers($channelId);

    echo json_encode([
        'status' => true,
        'message' => 'Hourly subscribers data fetched and saved',
        'data' => $result,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PARTIAL_OUTPUT_ON_ERROR);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'status' => false,
        'error' => $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PARTIAL_OUTPUT_ON_ERROR);
}

