<?php
// test_webhook.php

$webhook_url = 'https://api.tgcheckup.ru/webhooks/payment.php'; // Замените на ваш endpoint

$data = [
    'type' => 'notification',
    'event' => 'payment.succeeded',
    'object' => [
        'id' => '30ad811a-000f-5000-8000-13565a966564',
        'status' => 'succeeded',
        'amount' => [
            'value' => '299.00',
            'currency' => 'RUB'
        ],
        'income_amount' => [
            'value' => '288.53',
            'currency' => 'RUB'
        ],
        'description' => 'PRO travel, ЗОЖ и семью',
        'recipient' => [
            'account_id' => '1203529',
            'gateway_id' => '2571494'
        ],
        'payment_method' => [
            'type' => 'yoo_money',
            'id' => '30ad811a-000f-5000-8000-13565a966564',
            'saved' => false,
            'status' => 'inactive',
            'title' => 'YooMoney wallet 410011758831136',
            'account_number' => '410011758831136'
        ],
        'captured_at' => '2025-11-11T15:17:54.514Z',
        'created_at' => '2025-11-11T15:17:46.964Z',
        'test' => true,
        'refunded_amount' => [
            'value' => '0.00',
            'currency' => 'RUB'
        ],
        'paid' => true,
        'refundable' => true,
        'metadata' => [
            'channel_id' => '32144844',
            'owner_id' => '1'
        ]
    ]
];

$headers = [
    'Accept: */*',
    'User-Agent: AHC/2.1',
    'Content-Type: application/json',
    'Signature: v1 30a56796 1 MGQCMBlinNsNWtE5Emz8uANQrAsk/NViGqFiy+c/mHza+zqdlaukYg7/1TxsWbX1BuGPIwIwW9605z+QdHzWi/Dx4ZMx3QMAZx+9uIJhZoXjT/K6m/bfhdTYm/mJm6DfolVIPO6p',
    'Connection: close'
];

$ch = curl_init();

curl_setopt_array($ch, [
    CURLOPT_URL => $webhook_url,
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => $headers,
    CURLOPT_POSTFIELDS => json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT),
    CURLOPT_TIMEOUT => 30,
    CURLOPT_SSL_VERIFYPEER => false, // Для тестирования, в продакшене true
    CURLOPT_VERBOSE => true // Для отладки
]);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);

curl_close($ch);

echo "HTTP Code: " . $http_code . "\n";
echo "Response: " . $response . "\n";
if ($error) {
    echo "Error: " . $error . "\n";
}
?>