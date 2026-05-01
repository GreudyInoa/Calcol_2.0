<?php
namespace App\Controllers;

use App\Services\UsuarioService;
use App\Utils\Response;

class UsuarioController
{
    public function editar(array $request): void
    {
        try {
            $usuarioId = $request['auth_user']['id'];
            $service   = new UsuarioService();
            $usuario   = $service->editar($request, $usuarioId);
            Response::success(['usuario' => $usuario], 'Perfil actualizado');
        } catch (\InvalidArgumentException $e) { Response::validationError($e->getMessage());
        } catch (\Throwable $e)                { error_log('[Usuario] '.$e->getMessage()); Response::serverError(); }
    }

    public function eliminar(array $request): void
    {
        try {
            $usuarioId = $request['auth_user']['id'];
            (new UsuarioService())->eliminar($usuarioId);
            Response::success([], 'Cuenta eliminada');
        } catch (\DomainException $e) { Response::validationError($e->getMessage());
        } catch (\Throwable $e)       { error_log('[Usuario] '.$e->getMessage()); Response::serverError(); }
    }
}