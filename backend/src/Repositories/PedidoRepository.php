<?php
namespace App\Repositories;

use App\Models\Pedido;
use Illuminate\Database\Capsule\Manager as Capsule;

class PedidoRepository
{
    public function createConDetalles(array $cabecera, array $items): int
    {
        return Capsule::transaction(function () use ($cabecera, $items) {
            $pedido         = Pedido::create($cabecera);
            $inventarioRepo = new InventarioRepository();

            foreach ($items as $item) {
                Capsule::table('detalle_pedidos')->insert([
                    'pedido_id'       => $pedido->id,
                    'producto_id'     => (int) $item['producto_id'],
                    'cantidad'        => (int) $item['cantidad'],
                    'precio_unitario' => (int) $item['precio'],
                    'nota'            => $item['nota'] ?? '',
                ]);

                $inventarioRepo->registrarMovimiento(
                    productoId: (int) $item['producto_id'],
                    tipo:       'salida',
                    cantidad:   (int) $item['cantidad'],
                    motivo:     'Pedido #' . $pedido->id,
                    pedidoId:   $pedido->id,
                );
            }

            return $pedido->id;
        });
    }

    public function tienePedidosActivos(int $usuarioId): bool
    {
        return Pedido::where('usuario_id', $usuarioId)->activos()->exists();
    }
}