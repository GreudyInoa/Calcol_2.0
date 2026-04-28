<?php
require_once __DIR__ . '/../src/middleware/cors.php';
require_once __DIR__ . '/../src/config/database.php';
require_once __DIR__ . '/../src/utils/Response.php';
require_once __DIR__ . '/../src/controllers/AuthController.php';

applyCorsHeaders('POST');
$data = json_decode(file_get_contents('php://input'), true) ?? [];
AuthController::login($pdo, $data);