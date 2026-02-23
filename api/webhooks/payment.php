<?php

require_once __DIR__ . '/../db.php';
require __DIR__ . '/../channels/ChannelDataService.php';

class YookassaWebhookHandler {
    private $secretKey;
    
    public function __construct($secretKey) {
        $this->secretKey = $secretKey;
    }
    
    public function handle() {
        // Получаем сырые данные запроса
        $input = file_get_contents('php://input');
        $headers = getallheaders();
        
        // Логируем запрос для отладки
        $this->logRequest($input, $headers);

        // Декодируем JSON
        $data = json_decode($input, true);
        
        // Проверяем подпись (рекомендуется)
        if (!$this->verifyWithApi($data)) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid signature']);
            return;
        }
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON']);
            return;
        }
        
        // Обрабатываем уведомление
        $this->processNotification($data);
        
        // Отправляем успешный ответ
        echo json_encode(['status' => 'success']);
    }

    private function verifyWithApi($data) {
        $payment = $data['object'];
        $paymentId = $payment['id'];

        $url = "https://api.yookassa.ru/v3/payments/" . $paymentId;

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
            CURLOPT_USERPWD => '1203529:test_wsCWQgKfrZb0c3iNzH--Jh_0OOgnSWdpQjGms53D56k',
            CURLOPT_TIMEOUT => 10,
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            return false;
        }

        $paymentData = json_decode($response, true);

        // Проверяем, что платеж существует и данные совпадают
        return isset($paymentData['id']) && $paymentData['id'] === $paymentId;
    }
    
    private function processNotification($data) {
        $eventType = $data['event'] ?? 'unknown';
        $object = $data['object'] ?? [];

        $to = 'i.krasovsky@yandex.ru';
        $subject = 'Yookassa notify';
        $message = json_encode(['data' => $object]);
        $headers = "From: tgcheckup.ru <i.krasovsky@yandex.ru>\r\n";

        $send = mail($to, $subject, $message, $headers);

        // Send email
        if(mail($to, $subject, $message, $headers)) {
            echo 'Email sent successfully!';
        } else {
            echo 'Email failed to send.';
        }
        
        switch ($eventType) {
            case 'payment.succeeded':
                $this->handlePaymentSucceeded($object);
                break;
                
            case 'payment.canceled':
                $this->handlePaymentCanceled($object);
                break;
                
            default:
                $this->logEvent("Unknown event type: " . $eventType);
        }
    }

    private function handlePaymentSucceeded($payment) {
        $paymentId = $payment['id'];
        $channelId = $payment['metadata']['channel_id'];
        $ownerId = $payment['metadata']['owner_id'];

        $this->logEvent("Payment succeeded: {$paymentId}");
        
        // Обновляем статус заказа в вашей системе
        $this->updateOrderStatus($payment);
        
        // Получаем и сохраняем данные канала через сервис
        $channelService = new ChannelDataService();
        $channelService->getAndSaveChannelData($channelId, $ownerId);
    }
    
    private function handlePaymentCanceled($payment) {
        $paymentId = $payment['id'];
        $this->logEvent("Payment canceled: {$paymentId}");
        
        // Обновляем статус заказа в вашей системе
        $this->updateOrderStatus($payment);
    }
    
    private function updateOrderStatus($payment) {
        $paymentId = $payment['id'];
        $channel_id = $payment['metadata']['channel_id'];
        $channel_name = $payment['description'];
        $price = $payment['amount']['value'];
        $status = $payment['status'];
        $owner_id = $payment['metadata']['owner_id'];
        $created_at = $payment['created_at'];

        try {
            $pdo = getPdoConnection();

            // Сначала проверяем существование записи
            $checkSql = 'SELECT payment_id FROM payment WHERE payment_id = :payment_id';
            $checkStmt = $pdo->prepare($checkSql);
            $checkStmt->bindValue(':payment_id', $paymentId, PDO::PARAM_STR);
            $checkStmt->execute();

            $existingRecord = $checkStmt->fetch(PDO::FETCH_ASSOC);

            if ($existingRecord) {
                // Если запись существует - обновляем
                $updateSql = 'UPDATE payment SET 
                    channel_id = :channel_id,
                    channel_name = :channel_name,
                    price = :price,
                    status = :status,
                    owner_id = :owner_id,
                    created_at = :created_at
                  WHERE payment_id = :payment_id';

                $stmt = $pdo->prepare($updateSql);
                $stmt->bindValue(':payment_id', $paymentId, PDO::PARAM_STR);
                $stmt->bindValue(':channel_id', $channel_id, PDO::PARAM_INT);
                $stmt->bindValue(':channel_name', $channel_name, PDO::PARAM_STR);
                $stmt->bindValue(':price', $price, PDO::PARAM_INT);
                $stmt->bindValue(':status', $status, PDO::PARAM_STR);
                $stmt->bindValue(':owner_id', $owner_id, PDO::PARAM_INT);
                $stmt->bindValue(':created_at', $created_at, PDO::PARAM_STR);
                $stmt->execute();

                // Логируем обновление
                error_log("Payment record updated: " . $paymentId);
            } else {
                error_log("Payment not found: " . $paymentId);
            }


            return;
        } catch (Throwable $e) {
            http_response_code(500);
            echo json_encode([
                'status' => false,
                'error' => $e->getMessage(),
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PARTIAL_OUTPUT_ON_ERROR);
        }

        // Ваша логика обновления статуса заказа в БД
        file_put_contents('logs/orders.log', 
            date('Y-m-d H:i:s') . " - Payment {$paymentId} status: {$status}\n", 
            FILE_APPEND
        );
    }
    
    private function logRequest($body, $headers) {
        $logData = [
            'timestamp' => date('Y-m-d H:i:s'),
            'headers' => $headers,
            'body' => $body
        ];
        
        file_put_contents('logs/webhook_requests.log', 
            json_encode($logData) . "\n", 
            FILE_APPEND
        );
    }
    
    private function logEvent($message) {
        file_put_contents('logs/events.log', 
            date('Y-m-d H:i:s') . " - " . $message . "\n", 
            FILE_APPEND
        );
    }
}


// Запуск обработчика
$handler = new YookassaWebhookHandler('test_wsCWQgKfrZb0c3iNzH--Jh_0OOgnSWdpQjGms53D56k');
$handler->handle();
?>