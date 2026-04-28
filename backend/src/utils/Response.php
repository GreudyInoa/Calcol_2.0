<?php
class Response {
    public static function json(array $data, int $code = 200): void {
        http_response_code($code);
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }

    public static function success(array $data = [], string $message = ''): void {
        $payload = ['success' => true];
        if ($message) $payload['mensaje'] = $message;
        self::json(array_merge($payload, $data));
    }

    public static function error(string $message, int $code = 400): void {
        self::json(['error' => $message], $code);
    }
}