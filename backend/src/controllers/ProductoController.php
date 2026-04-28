<?php
class ProductoController {
    public static function listar(PDO $pdo): void {
        $categoria = $_GET['categoria'] ?? '';

        if ($categoria) {
            $stmt = $pdo->prepare('SELECT * FROM productos WHERE categoria = ? AND agotado = 0');
            $stmt->execute([$categoria]);
        } else {
            $stmt = $pdo->query('SELECT * FROM productos WHERE agotado = 0');
        }

        Response::success(['productos' => $stmt->fetchAll()]);
    }
}