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
$channel_id = isset($input['channel_id']) ? (int)$input['channel_id'] : 0;
$channel_name = isset($input['channel_name']) ? trim((string)$input['channel_name']) : '';
$price = isset($input['price']) ? (int)$input['price'] : 0;
$owner_id = isset($input['owner_id']) ? (int)$input['owner_id'] : 0;

if ($hash !== 'f38e8c02a69ac54996688c8830533' || $price === 0 || $channel_id === 0 || $owner_id === 0) {
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

$data = $channel_id . '|' . time() . '|' . $owner_id;
$hash =  md5($data);

$payment = $client->createPayment(
    array(
        'amount' => array(
            'value' => $price,
            'currency' => 'RUB',
        ),
        'confirmation' => array(
            'type' => 'redirect',
            'return_url' => 'http://localhost:3000/payment?id='. $hash,
//            'return_url' => 'https://tgcheckup.ru/payment?id='. $hash,
        ),
        "metadata" => array(
            "channel_id" => $channel_id,
            "owner_id" => $owner_id
        ),
        'capture' => true,
        'description' => $channel_name,
    ),
    uniqid('', true)
);


//get confirmation token
$confirmationUrl = $payment->getId();
$confirmationUrl = $payment->getConfirmation()->getConfirmationUrl();

if ($confirmationUrl) {
    try {
        $pdo = getPdoConnection();

        // Prepare upsert into channels
        $sql = 'INSERT INTO payment (hash, payment_id, channel_id, channel_name, price, status, owner_id) 
                    VALUES (:hash, :payment_id, :channel_id, :channel_name, :price, :status, :owner_id) 
                    ON DUPLICATE KEY UPDATE
                        hash = VALUES(hash),
                        payment_id = VALUES(payment_id),
                        channel_id = VALUES(channel_id),
                        channel_name = VALUES(channel_name),
                        price = VALUES(price),
                        status = VALUES(status),
                        owner_id = VALUES(owner_id)';

        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':hash', $hash, PDO::PARAM_STR);
        $stmt->bindValue(':payment_id', $payment->getId(), PDO::PARAM_STR);
        $stmt->bindValue(':channel_id', $channel_id, PDO::PARAM_INT);
        $stmt->bindValue(':channel_name', $channel_name, PDO::PARAM_STR);
        $stmt->bindValue(':price', $price, PDO::PARAM_INT);
        $stmt->bindValue(':status', 'waiting', PDO::PARAM_STR);
        $stmt->bindValue(':owner_id', $owner_id, PDO::PARAM_INT);
        $stmt->execute();

        echo json_encode([
            'status' => true,
            'data' => $confirmationUrl,
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        return;
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode([
            'status' => false,
            'error' => $e->getMessage(),
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PARTIAL_OUTPUT_ON_ERROR);
    }
}
?>
