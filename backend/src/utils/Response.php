<?php
namespace App\Utils;

class Response
{
    public static function json(array $data, int $code = 200): void
    {
        http_response_code($code);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function success(array $data = [], string $message = ''): void
    {
        $payload = ['success' => true];
        if ($message) $payload['mensaje'] = $message;
        self::json(array_merge($payload, $data));
    }

    public static function error(string $message, int $code = 400): void
    {
        self::json(['error' => $message], $code);
    }

    public static function notFound(string $message = 'Recurso no encontrado'): void
    {
        self::json(['error' => $message], 404);
    }

    public static function unauthorized(string $message = 'No autorizado'): void
    {
        self::json(['error' => $message], 401);
    }

    public static function validationError(string $message): void
    {
        self::json(['error' => $message], 422);
    }

    public static function serverError(): void
    {
        self::json(['error' => 'Error interno del servidor'], 500);
    }
}