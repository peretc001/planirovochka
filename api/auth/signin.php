<?php

declare(strict_types=1);

require __DIR__ . '/../db.php';

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

header('Content-Type: application/json');

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => false,
        'error' => 'Method not allowed',
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

try {
    // Get JSON input
    $rawBody = file_get_contents('php://input') ?: '';
    $input = json_decode($rawBody, true);

    if (!is_array($input)) {
        http_response_code(400);
        echo json_encode([
            'status' => false,
            'error' => 'Invalid JSON body',
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    $hash = isset($input['hash']) ? trim((string)$input['hash']) : '';
    if ($hash !== 'f38e8c02a69ac54996688c8830533') {
        http_response_code(422);
        echo json_encode([
            'status' => false,
            'error' => 'Bad request',
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    // Get and validate email
    $email = isset($input['email']) ? trim((string)$input['email']) : '';
    $password = isset($input['password']) ? trim((string)$input['password']) : '';

    if ($email === '' || $password === '') {
        http_response_code(422);
        echo json_encode([
            'status' => false,
            'error' => 'Все поля обязательны',
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(422);
        echo json_encode([
            'status' => false,
            'error' => 'Неверный формат email',
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }


    $pdo = getPdoConnection();

    // Find user by email
    $stmt = $pdo->prepare('SELECT id, name, email, password, created_at FROM users WHERE email = :email');
    $stmt->bindValue(':email', $email, PDO::PARAM_STR);
    $stmt->execute();
    $user = $stmt->fetch();

    // Check if user exists
    if (!$user) {
        http_response_code(401);
        echo json_encode([
            'status' => false,
            'error' => 'Неверный email или пароль',
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    // Verify password
    if (!password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode([
            'status' => false,
            'error' => 'Неверный email или пароль',
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    // Remove password from response
    unset($user['password']);

    // Return user data
    echo json_encode([
        'status' => true,
        'message' => 'Авторизация успешна',
        'data' => $user,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'status' => false,
        'error' => 'Database error: ' . $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

