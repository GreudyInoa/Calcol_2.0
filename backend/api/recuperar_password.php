<?php
require_once __DIR__ . '/../src/middleware/cors.php';
require_once __DIR__ . '/../src/config/database.php';
require_once __DIR__ . '/../src/utils/Response.php';
require_once __DIR__ . '/../src/services/EmailService.php';

applyCorsHeaders('POST');

$env   = parse_ini_file(__DIR__ . '/../../.env');
$data  = json_decode(file_get_contents('php://input'), true) ?? [];
$email = trim($data['email'] ?? '');

if (!$email) Response::error('El correo es obligatorio');

$stmt = $pdo->prepare('SELECT id FROM usuarios WHERE email = ?');
$stmt->execute([$email]);
if (!$stmt->fetch()) Response::success();

$token      = bin2hex(random_bytes(32));
$expiracion = date('Y-m-d H:i:s', strtotime('+1 hour'));

$pdo->prepare('DELETE FROM recuperacion_password WHERE email = ?')->execute([$email]);
$pdo->prepare('INSERT INTO recuperacion_password (email, token, expiracion) VALUES (?, ?, ?)')->execute([$email, $token, $expiracion]);

$appUrl = $env['APP_URL'] ?? 'http://localhost/Calcol';
$link   = $appUrl . '/pages/nueva-password.html?token=' . $token;

try {
    $emailService = new EmailService($env);
    $emailService->enviarRecuperacion($email, $link);
    Response::success();
} catch (Exception $e) {
    Response::error('No se pudo enviar el email. Inténtalo más tarde.', 500);
}