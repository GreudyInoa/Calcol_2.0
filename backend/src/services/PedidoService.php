<?php
namespace App\Services;

use App\Repositories\ProductoRepository;
use App\Repositories\InventarioRepository;
use App\Repositories\PedidoRepository;
use App\Validators\PedidoValidator;

class PedidoService
{
    private const COSTO_ENVIO = 2000;

    private ProductoRepository   $productoRepo;
    private InventarioRepository $inventarioRepo;
    private PedidoRepository     $pedidoRepo;

    public function __construct()
    {
        $this->productoRepo   = new ProductoRepository();
        $this->inventarioRepo = new InventarioRepository();
        $this->pedidoRepo     = new PedidoRepository();
    }

    public function crear(array $data, int $usuarioId): int
    {
        PedidoValidator::crear($data);

        $items    = $data['items'];
        $subtotal = 0;

        // Verificar stock y calcular precios en servidor
        foreach ($items as &$item) {
            $producto = $this->productoRepo->findById((int) $item['producto_id']);

            if (!$producto || !$producto->disponible) {
                throw new \DomainException("Producto #{$item['producto_id']} no disponible");
            }

            $stock = $this->inventarioRepo->getStock($producto->id);
            if ($stock < (int) $item['cantidad']) {
                throw new \DomainException(
                    "Stock insuficiente para '{$producto->nombre}' (disponible: {$stock})"
                );
            }

            $item['precio'] = $producto->precio; // precio real del servidor
            $subtotal += $producto->precio * (int) $item['cantidad'];
        }
        unset($item);

        $total = $subtotal + self::COSTO_ENVIO;

        $cabecera = [
            'usuario_id'    => $usuarioId,
            'direccion'     => trim($data['direccion']),
            'instrucciones' => trim($data['instrucciones'] ?? ''),
            'subtotal'      => $subtotal,
            'envio'         => self::COSTO_ENVIO,
            'total'         => $total,
            'cubiertos'     => (int) ($data['cubiertos'] ?? 0),
            'salsa'         => (int) ($data['salsa']     ?? 0),
            'metodo_pago'   => $data['metodo_pago'] ?? 'efectivo',
            'estado'        => 'pendiente',
        ];

        return $this->pedidoRepo->createConDetalles($cabecera, $items);
    }
}