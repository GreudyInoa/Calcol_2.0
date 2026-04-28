<?php
class PedidoController {
    private const COSTO_ENVIO = 2000;

    public static function crear(PDO $pdo, array $data): void {
        $usuario_id    = $data['usuario_id']    ?? null;
        $direccion     = trim($data['direccion']     ?? '');
        $instrucciones = trim($data['instrucciones'] ?? '');
        $subtotal      = (int)  ($data['subtotal']   ?? 0);
        $envio         = (int)  ($data['envio']      ?? self::COSTO_ENVIO);
        $total         = (int)  ($data['total']      ?? 0);
        $cubiertos     = (int)  ($data['cubiertos']  ?? 0);
        $salsa         = (int)  ($data['salsa']      ?? 0);
        $items         = $data['items'] ?? [];

        if (!$direccion || empty($items)) {
            Response::error('Faltan datos del pedido');
        }

        try {
            $pdo->beginTransaction();

            $stmt = $pdo->prepare('
                INSERT INTO pedidos
                    (usuario_id, direccion, instrucciones, subtotal, envio, total, cubiertos, salsa)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ');
            $stmt->execute([$usuario_id, $direccion, $instrucciones, $subtotal, $envio, $total, $cubiertos, $salsa]);
            $pedido_id = (int) $pdo->lastInsertId();

            foreach ($items as $item) {
                $stmt = $pdo->prepare('
                    INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario, nota)
                    VALUES (?, ?, ?, ?, ?)
                ');
                $stmt->execute([
                    $pedido_id,
                    $item['producto_id'],
                    (int) $item['cantidad'],
                    (int) $item['precio'],
                    $item['nota'] ?? '',
                ]);

                $stmt = $pdo->prepare('UPDATE productos SET stock = stock - ? WHERE id = ?');
                $stmt->execute([(int) $item['cantidad'], $item['producto_id']]);

                $stmt = $pdo->prepare('UPDATE productos SET agotado = 1 WHERE id = ? AND stock <= 0');
                $stmt->execute([$item['producto_id']]);

                $stmt = $pdo->prepare('INSERT INTO inventario (producto_id, tipo, cantidad, motivo) VALUES (?, "salida", ?, ?)');
                $stmt->execute([$item['producto_id'], (int) $item['cantidad'], 'Pedido #' . $pedido_id]);
            }

            $pdo->commit();
            Response::success(['pedido_id' => $pedido_id], 'Pedido creado correctamente');

        } catch (Exception $e) {
            $pdo->rollBack();
            Response::error('Error al crear el pedido: ' . $e->getMessage(), 500);
        }
    }
}