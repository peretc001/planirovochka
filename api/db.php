<?php

declare(strict_types=1);

/**
 * Returns a PDO connection to the MySQL database.
 */
function getPdoConnection(): PDO
{
    $host = 'localhost';
    $port = 3306;
    $databaseName = 'u3321321_planirovochka';
    $username = 'u3321321_planirovochka';
    $password = 'oI9eR7oO7idJ6mG2';

    $charset = 'utf8mb4';
    $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=%s', $host, $port, $databaseName, $charset);

    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];

    return new PDO($dsn, $username, $password, $options);
}


