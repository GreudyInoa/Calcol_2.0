<?php
namespace App\Services;

use App\Repositories\UsuarioRepository;
use App\Repositories\PedidoRepository;
use App\Validators\UsuarioValidator;

class UsuarioService
{
    private UsuarioRepository $usuarioRepo;
    private PedidoRepository  $pedidoRepo;

    public function __construct()
    {
        $this->usuarioRepo = new UsuarioRepository();
        $this->pedidoRepo  = new PedidoRepository();
    }

    public function editar(array $data, int $usuarioId): array
    {
        UsuarioValidator::editar($data);

        $updates = ['nombre' => trim($data['nombre'])];
        if (!empty($data['telefono'])) {
            $updates['telefono'] = trim($data['telefono']);
        }

        $this->usuarioRepo->updateById($usuarioId, $updates);

        $usuario = $this->usuarioRepo->findById($usuarioId);
        return [
            'id'       => $usuario->id,
            'nombre'   => $usuario->nombre,
            'email'    => $usuario->email,
            'telefono' => $usuario->telefono,
            'rol'      => $usuario->rol,
        ];
    }

    public function eliminar(int $usuarioId): void
    {
        if ($this->pedidoRepo->tienePedidosActivos($usuarioId)) {
            throw new \DomainException('Tienes un pedido en curso. No puedes eliminar tu cuenta hasta que sea completado.');
        }
        $this->usuarioRepo->deleteById($usuarioId);
    }
}