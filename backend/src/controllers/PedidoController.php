<?php
namespace App\Controllers;

use App\Services\PedidoService;
use App\Utils\Response;

class PedidoController
{
    public function crear(array $request): void
    {
        try {
            $usuarioId = $request['auth_user']['id'];
            $service   = new PedidoService();
            $pedidoId  = $service->crear($request, $usuarioId);
            Response::success(['pedido_id' => $pedidoId], 'Pedido creado correctamente');
        } catch (\InvalidArgumentException $e) { Response::validationError($e->getMessage());
        } catch (\DomainException $e)          { Response::validationError($e->getMessage());
        } catch (\Throwable $e)                { error_log('[Pedido] '.$e->getMessage()); Response::serverError(); }
    }
}