<?php

declare(strict_types=1);

require dirname(__DIR__, 2) . '/db.php';

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
$token = '0101847a8c43e26ffde4d45ac2566e63';

// Validation
if ($channelId === '' || $hash !== 'f38e8c02a69ac54996688c8830533') {
    http_response_code(422);
    echo json_encode([
        'status' => false,
        'error' => 'Bad request',
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}


try {
    // Вычисляем даты: сейчас и 30 дней назад
    $now = time();
    $startDate = $now - (24 * 60 * 60); // 30 дней назад
    $endDate = $now;
    $group = 'hour';

    // Построение URL для запроса к API
    $url = sprintf(
        'https://api.tgstat.ru/channels/subscribers?token=%s&channelId=%s&startDate=%d&endDate=%d&group=%s',
        urlencode($token),
        urlencode($channelId),
        $startDate,
        $endDate,
        urlencode($group)
    );

    // Выполнение запроса к API
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_TIMEOUT => 20,
    ]);

    $response = curl_exec($ch);
    $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    // Проверка ошибок curl
    if ($response === false || !empty($curlError)) {
        http_response_code(502);
        echo json_encode([
            'status' => false,
            'error' => 'CURL error: ' . ($curlError ?: 'Unknown error'),
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    // Проверка HTTP кода
    if ($httpCode >= 400) {
        http_response_code(502);
        echo json_encode([
            'status' => false,
            'error' => 'HTTP error: ' . $httpCode,
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    // Декодирование JSON ответа
    $data = json_decode($response, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(502);
        echo json_encode([
            'status' => false,
            'error' => 'JSON decode error: ' . json_last_error_msg(),
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    // Проверка статуса ответа API
    if (!is_array($data) || !isset($data['status'])) {
        http_response_code(502);
        echo json_encode([
            'status' => false,
            'error' => 'Unexpected API response format',
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    if ($data['status'] !== 'ok') {
        $error = $data['error'] ?? 'Unknown error';
        http_response_code(502);
        echo json_encode([
            'status' => false,
            'error' => 'API error: ' . $error,
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    // Сохранение данных в базу данных
    $pdo = getPdoConnection();
    $sql = 'INSERT INTO channel_followers (
        channel_id, period, participants_count, date
    ) VALUES (
        :channel_id, :period, :participants_count, :date
    ) ON DUPLICATE KEY UPDATE
        participants_count = VALUES(participants_count)';

    $stmt = $pdo->prepare($sql);
    $savedCount = 0;

    // Обработка данных из ответа API
    // response - это массив объектов с полями period и participants_count
    if (isset($data['response']) && is_array($data['response'])) {
        foreach ($data['response'] as $item) {
            if (!is_array($item)) {
                continue;
            }

            $period = $item['period'] ?? null;
            $participantsCount = $item['participants_count'] ?? 0;

            if ($period) {
                // Преобразуем period (YYYY-MM-DD) в timestamp
                $dateTimestamp = strtotime($period);

                if ($dateTimestamp === false) {
                    continue; // Пропускаем невалидные даты
                }

                $stmt->bindValue(':channel_id', $channelId, PDO::PARAM_STR);
                $stmt->bindValue(':period', $period, PDO::PARAM_STR);
                $stmt->bindValue(':participants_count', (int)$participantsCount, PDO::PARAM_INT);
                $stmt->bindValue(':date', $dateTimestamp, PDO::PARAM_INT);
                $stmt->execute();
                $savedCount++;
            }
        }
    }

    echo json_encode([
        'status' => true,
        'message' => 'Daily subscribers data fetched and saved',
        'channelId' => $channelId,
        'group' => $group,
        'startDate' => $startDate,
        'endDate' => $endDate,
        'savedCount' => $savedCount,
        'data' => $data['response'] ?? [],
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PARTIAL_OUTPUT_ON_ERROR);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'status' => false,
        'error' => $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PARTIAL_OUTPUT_ON_ERROR);
}
