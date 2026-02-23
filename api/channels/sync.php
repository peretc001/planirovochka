<?php

declare(strict_types=1);

require __DIR__ . '/ChannelDataService.php';

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

//if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
//    http_response_code(405);
//    header('Content-Type: application/json');
//    echo json_encode([
//        'status' => false,
//        'error' => 'Method not allowed. Use POST.',
//    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
//    exit;
//}

header('Content-Type: application/json');

try {
    // Accept both GET and POST inputs
    $payload = $_SERVER['REQUEST_METHOD'] === 'POST'
        ? (json_decode(file_get_contents('php://input') ?: '', true) ?? [])
        : $_GET;

//    // Get JSON input
//    $rawBody = file_get_contents('php://input') ?: '';
//    $payload = json_decode($rawBody, true);

    if (!is_array($payload)) {
        http_response_code(400);
        echo json_encode([
            'status' => false,
            'error' => 'Invalid JSON body',
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    // Validate required fields
    $channel_id = isset($payload['channel_id']) ? (int)$payload['channel_id'] : 0;
    $owner_id = isset($payload['owner_id']) ? (int)$payload['owner_id'] : 0;

    if ($channel_id <= 0 || $owner_id <= 0) {
        http_response_code(422);
        echo json_encode([
            'status' => false,
            'error' => 'channel_id and owner_id are required and must be positive integers',
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    // Create service instance and process
    $service = new ChannelDataService();
    $result = $service->getAndSaveChannelData($channel_id, $owner_id);

    if ($result['status']) {
        http_response_code(200);
        echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    } else {
        http_response_code(500);
        echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'status' => false,
        'error' => $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}



