<?php
namespace App\Middleware;

use App\Services\JwtService;
use App\Utils\Response;

class AuthMiddleware
{
    public static function handle(array $request): array
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

        if (!str_starts_with($header, 'Bearer ')) {
            Response::unauthorized('Token de autenticación requerido');
        }

        $token = substr($header, 7);

        try {
            $jwt     = new JwtService();
            $payload = $jwt->verify($token);
        } catch (\RuntimeException $e) {
            Response::unauthorized($e->getMessage());
        }

        $request['auth_user'] = [
            'id'    => $payload['id']    ?? null,
            'email' => $payload['email'] ?? null,
            'rol'   => $payload['rol']   ?? 'cliente',
        ];

        return $request;
    }
}