<?php
namespace App\Repositories;

use Illuminate\Database\Capsule\Manager as Capsule;

class InventarioRepository
{
    public function getStock(int $productoId): int
    {
        $result = Capsule::table('inventario')
            ->selectRaw('SUM(CASE WHEN tipo = "entrada" THEN cantidad ELSE -cantidad END) AS stock')
            ->where('producto_id', $productoId)
            ->value('stock');
        return (int) ($result ?? 0);
    }

    public function registrarMovimiento(int $productoId, string $tipo, int $cantidad, string $motivo, ?int $pedidoId = null): void
    {
        Capsule::table('inventario')->insert([
            'producto_id' => $productoId,
            'pedido_id'   => $pedidoId,
            'tipo'        => $tipo,
            'cantidad'    => $cantidad,
            'motivo'      => $motivo,
            'fecha'       => date('Y-m-d H:i:s'),
        ]);
    }
}