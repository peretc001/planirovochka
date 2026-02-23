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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Content-Type: application/json');
    echo json_encode([
        'status' => false,
        'error' => 'Method not allowed. Use POST.',
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

header('Content-Type: application/json');

try {
    $pdo = getPdoConnection();

    // Get JSON input
    $rawBody = file_get_contents('php://input') ?: '';
    $payload = json_decode($rawBody, true);

    if (!is_array($payload)) {
        http_response_code(400);
        echo json_encode([
            'status' => false,
            'error' => 'Invalid JSON body',
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    // Validate and sanitize input
    $hash = isset($payload['hash']) ? trim((string)$payload['hash']) : '';
    $name = isset($payload['name']) ? trim((string)$payload['name']) : '';
    $email = isset($payload['email']) ? trim((string)$payload['email']) : '';
    $password = isset($payload['password']) ? (string)$payload['password'] : '';

    if ($hash !== 'f38e8c02a69ac54996688c8830533') {
        http_response_code(422);
        echo json_encode([
            'status' => false,
            'error' => 'Bad request',
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    if ($name === '' || $email === '' || $password === '') {
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

    // Check if email already exists
    $checkStmt = $pdo->prepare('SELECT id FROM users WHERE email = :email');
    $checkStmt->bindValue(':email', $email, PDO::PARAM_STR);
    $checkStmt->execute();
    if ($checkStmt->fetch()) {
        http_response_code(409);
        echo json_encode([
            'status' => false,
            'error' => 'Пользователь с таким email уже существует',
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    // Hash password (use password_hash for security)
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insert into database
    $stmt = $pdo->prepare('INSERT INTO users (name, email, password) VALUES (:name, :email, :password)');
    $stmt->bindValue(':name', $name, PDO::PARAM_STR);
    $stmt->bindValue(':email', $email, PDO::PARAM_STR);
    $stmt->bindValue(':password', $hashedPassword, PDO::PARAM_STR);
    $stmt->execute();

    $id = (int)$pdo->lastInsertId();

    // Fetch the created row
    $select = $pdo->prepare('SELECT id, name, email FROM users WHERE id = :id');
    $select->bindValue(':id', $id, PDO::PARAM_INT);
    $select->execute();
    $row = $select->fetch();

    http_response_code(201);
    echo json_encode([
        'status' => true,
        'message' => 'Пользователь создан успешно',
        'data' => $row,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'status' => false,
        'error' => 'Database error: ' . $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}





