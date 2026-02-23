<?php

declare(strict_types=1);

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

$token = '0101847a8c43e26ffde4d45ac2566e63';


// Get JSON input
$rawBody = file_get_contents('php://input') ?: '';
$input = json_decode($rawBody, true);

$hash = isset($input['hash']) ? trim((string)$input['hash']) : '';
$search = isset($input['search']) ? trim((string)$input['search']) : '';

if ($search === '' || $hash !== 'f38e8c02a69ac54996688c8830533') {
    http_response_code(422);
    echo json_encode([
        'status' => false,
        'error' => 'Bad request',
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

// Build TGStat URL
$url = sprintf('https://api.tgstat.ru/channels/search?token=%s&q=%s&country=ru', urlencode($token), urlencode($search));

// Initialize curl
$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_CONNECTTIMEOUT => 10,
    CURLOPT_TIMEOUT => 20,
]);

// Execute request
$resp = curl_exec($ch);
$curlErr = curl_error($ch);
$httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);

// Clean up
curl_close($ch);

// Check response
if ($resp === false || $httpCode >= 400) {
    http_response_code(502);
    echo json_encode([
        'status' => false,
        'error' => 'TGStat request failed: ' . ($curlErr ?: ('HTTP ' . $httpCode)),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

$payload = json_decode($resp, true);
if (!is_array($payload) || !isset($payload['status']) || $payload['status'] !== 'ok' || !isset($payload['response'])) {
    http_response_code(502);
    echo json_encode([
        'status' => false,
        'error' => 'Unexpected TGStat response',
        'raw' => $payload,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

$data = $payload['response'];

echo json_encode([
    'status' => true,
    'data' => $data['items'],
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PARTIAL_OUTPUT_ON_ERROR);



