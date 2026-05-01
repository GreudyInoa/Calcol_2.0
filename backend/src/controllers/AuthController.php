<?php
namespace App\Controllers;

use App\Services\AuthService;
use App\Utils\Response;

class AuthController
{
    public function login(array $request): void
    {
        try {
            $service = new AuthService();
            $result  = $service->login($request);
            Response::success($result);
        } catch (\InvalidArgumentException $e) { Response::validationError($e->getMessage());
        } catch (\DomainException $e)          { Response::error($e->getMessage(), 401);
        } catch (\Throwable $e)                { error_log('[Auth/login] ' . $e->getMessage()); Response::serverError(); }
    }

    public function registro(array $request): void
    {
        try {
            $service = new AuthService();
            $result  = $service->registro($request);
            Response::success($result);
        } catch (\InvalidArgumentException $e) { Response::validationError($e->getMessage());
        } catch (\DomainException $e)          { Response::error($e->getMessage(), 409);
        } catch (\Throwable $e)                { error_log('[Auth/registro] ' . $e->getMessage()); Response::serverError(); }
    }

    public function recuperarPassword(array $request): void
    {
        try {
            (new AuthService())->recuperarPassword($request);
            Response::success();
        } catch (\InvalidArgumentException $e) { Response::validationError($e->getMessage());
        } catch (\Throwable $e)                { error_log('[Auth/recuperar] ' . $e->getMessage()); Response::success(); }
    }

    public function nuevaPassword(array $request): void
    {
        try {
            (new AuthService())->nuevaPassword($request);
            Response::success([], 'Contraseña actualizada');
        } catch (\InvalidArgumentException $e) { Response::validationError($e->getMessage());
        } catch (\DomainException $e)          { Response::error($e->getMessage(), 400);
        } catch (\Throwable $e)                { error_log('[Auth/nueva] ' . $e->getMessage()); Response::serverError(); }
    }
}