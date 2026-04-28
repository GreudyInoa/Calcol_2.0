<?php
$env = parse_ini_file(__DIR__ . '/../../../.env');

$host    = $env['DB_HOST'] ?? 'localhost';
$db      = $env['DB_NAME'] ?? 'calcol';
$user    = $env['DB_USER'] ?? 'root';
$pass    = $env['DB_PASS'] ?? '';
$charset = 'utf8mb4';

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$db;charset=$charset",
        $user,
        $pass,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de conexión con la base de datos']);
    exit;
}