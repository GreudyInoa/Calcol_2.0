<?php
require_once __DIR__ . '/../src/middleware/cors.php';
require_once __DIR__ . '/../src/config/database.php';
require_once __DIR__ . '/../src/utils/Response.php';

applyCorsHeaders('POST');

$data     = json_decode(file_get_contents('php://input'), true) ?? [];
$token    = trim($data['token']    ?? '');
$password = trim($data['password'] ?? '');

if (!$token || !$password) Response::error('Faltan campos obligatorios');
if (strlen($password) < 6)  Response::error('La contraseña debe tener al menos 6 caracteres');

$stmt = $pdo->prepare('SELECT * FROM recuperacion_password WHERE token = ? AND usado = 0 AND expiracion > NOW()');
$stmt->execute([$token]);
$recuperacion = $stmt->fetch();

if (!$recuperacion) Response::error('El link es inválido o ha expirado');

$hash = password_hash($password, PASSWORD_DEFAULT);
$pdo->prepare('UPDATE usuarios SET password = ? WHERE email = ?')->execute([$hash, $recuperacion['email']]);
$pdo->prepare('UPDATE recuperacion_password SET usado = 1 WHERE token = ?')->execute([$token]);

Response::success([], 'Contraseña actualizada');