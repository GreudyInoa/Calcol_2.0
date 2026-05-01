<?php
namespace App\Validators;

class PedidoValidator
{
    public static function crear(array $data): void
    {
        $direccion = trim($data['direccion'] ?? '');
        $items     = $data['items'] ?? [];

        if (strlen($direccion) < 5 || strlen($direccion) > 255) {
            throw new \InvalidArgumentException('La dirección debe tener entre 5 y 255 caracteres');
        }
        if (!is_array($items) || count($items) === 0) {
            throw new \InvalidArgumentException('El pedido debe tener al menos un producto');
        }

        foreach ($items as $i => $item) {
            $n = $i + 1;
            if (!is_numeric($item['producto_id'] ?? null) || (int)$item['producto_id'] < 1) {
                throw new \InvalidArgumentException("Ítem #{$n}: producto_id inválido");
            }
            $cantidad = (int)($item['cantidad'] ?? 0);
            if ($cantidad < 1 || $cantidad > 99) {
                throw new \InvalidArgumentException("Ítem #{$n}: la cantidad debe estar entre 1 y 99");
            }
        }
    }
}