<?php
declare(strict_types=0);
error_reporting(E_ALL ^ E_DEPRECATED);

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

require __DIR__ . '/lib/autoload.php';
require __DIR__ . '/../db.php';

$rawBody = file_get_contents('php://input') ?: '';
$input = json_decode($rawBody, true);

$hash = isset($input['hash']) ? trim((string)$input['hash']) : '';
$id = isset($input['id']) ? trim((string)$input['id']) : '';
$owner_id = isset($input['owner_id']) ? (int)$input['owner_id'] : 0;

if ($hash !== 'f38e8c02a69ac54996688c8830533' || $owner_id === 0) {
    http_response_code(422);
    echo json_encode([
        'status' => false,
        'error' => 'Bad request',
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

use YooKassa\Client;

$client = new Client();
$client->setAuth('1203529', 'test_wsCWQgKfrZb0c3iNzH--Jh_0OOgnSWdpQjGms53D56k');


try {
    $pdo = getPdoConnection();

    $getPayment = $pdo->prepare('SELECT payment_id, status, channel_id FROM payment WHERE hash = :hash');
    $getPayment->bindValue(':hash', $id, PDO::PARAM_STR);
    $getPayment->execute();
    $data = $getPayment->fetch();

    if (!$data) {
        http_response_code(409);
        echo json_encode([
            'status' => false,
            'error' => 'Платеж не найден',
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    $getChannel = $pdo->prepare('SELECT username FROM channels WHERE channel_id = :channel_id');
    $getChannel->bindValue(':channel_id', $data['channel_id'], PDO::PARAM_INT);
    $getChannel->execute();
    $getChannelLink = $getChannel->fetchColumn();

    $data['channel_link'] = $getChannelLink;

    echo json_encode([
        'status' => true,
        'data' => $data,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'status' => false,
        'error' => $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PARTIAL_OUTPUT_ON_ERROR);
}
?>
