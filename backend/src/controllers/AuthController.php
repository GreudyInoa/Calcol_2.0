<?php
class AuthController {
    public static function login(PDO $pdo, array $data): void {
        $email    = trim($data['email']    ?? '');
        $password = trim($data['password'] ?? '');

        if (!$email || !$password) Response::error('Faltan campos obligatorios');

        $stmt = $pdo->prepare('SELECT * FROM usuarios WHERE email = ?');
        $stmt->execute([$email]);
        $usuario = $stmt->fetch();

        if (!$usuario || !password_verify($password, $usuario['password'])) {
            Response::error('Usuario o contraseña incorrectos');
        }

        Response::success([
            'usuario' => [
                'id'       => $usuario['id'],
                'nombre'   => $usuario['nombre'],
                'email'    => $usuario['email'],
                'telefono' => $usuario['telefono'],
                'rol'      => $usuario['rol'],
            ],
        ], 'Login exitoso');
    }

    public static function registro(PDO $pdo, array $data): void {
        $nombre   = trim($data['nombre']   ?? '');
        $email    = trim($data['email']    ?? '');
        $password = trim($data['password'] ?? '');
        $telefono = trim($data['telefono'] ?? '');

        if (!$nombre || !$email || !$password) Response::error('Faltan campos obligatorios');
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) Response::error('Correo no válido');

        $stmt = $pdo->prepare('SELECT id FROM usuarios WHERE email = ?');
        $stmt->execute([$email]);
        if ($stmt->fetch()) Response::error('Este correo ya está registrado');

        $hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare('INSERT INTO usuarios (nombre, email, password, telefono, rol) VALUES (?, ?, ?, ?, "cliente")');
        $stmt->execute([$nombre, $email, $hash, $telefono]);

        Response::success([
            'usuario' => [
                'id'       => (int) $pdo->lastInsertId(),
                'nombre'   => $nombre,
                'email'    => $email,
                'telefono' => $telefono,
                'rol'      => 'cliente',
            ],
        ], 'Usuario registrado correctamente');
    }
}