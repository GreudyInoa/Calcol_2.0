<?php
class UsuarioController {
    public static function editar(PDO $pdo, array $data): void {
        $email    = trim($data['email']    ?? '');
        $nombre   = trim($data['nombre']   ?? '');
        $telefono = trim($data['telefono'] ?? '');

        if (!$email || !$nombre) Response::error('Faltan campos obligatorios');

        $stmt = $pdo->prepare('UPDATE usuarios SET nombre = ?, telefono = ? WHERE email = ?');
        $stmt->execute([$nombre, $telefono, $email]);

        Response::success([], 'Perfil actualizado');
    }

    public static function eliminar(PDO $pdo, array $data): void {
        $email = trim($data['email'] ?? '');
        if (!$email) Response::error('Email requerido');

        $stmt = $pdo->prepare('SELECT id FROM usuarios WHERE email = ?');
        $stmt->execute([$email]);
        $usuario = $stmt->fetch();
        if (!$usuario) Response::error('Usuario no encontrado');

        $stmt = $pdo->prepare("SELECT COUNT(*) AS total FROM pedidos WHERE usuario_id = ? AND estado IN ('pendiente', 'en_proceso', 'listo')");
        $stmt->execute([$usuario['id']]);
        if ($stmt->fetch()['total'] > 0) Response::error('Tienes un pedido en curso. No puedes eliminar tu cuenta hasta que sea completado.');

        $id = $usuario['id'];
        $pdo->prepare('DELETE dp FROM detalle_pedidos dp INNER JOIN pedidos p ON dp.pedido_id = p.id WHERE p.usuario_id = ?')->execute([$id]);
        $pdo->prepare('DELETE FROM pedidos WHERE usuario_id = ?')->execute([$id]);
        $pdo->prepare('DELETE FROM usuarios WHERE id = ?')->execute([$id]);

        Response::success([], 'Cuenta eliminada');
    }
}