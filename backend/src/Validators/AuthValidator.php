<?php
namespace App\Validators;

class AuthValidator
{
    public static function login(array $data): void
    {
        $email    = trim($data['email']    ?? '');
        $password = trim($data['password'] ?? '');

        if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException('El correo no tiene un formato válido');
        }
        if (!$password) {
            throw new \InvalidArgumentException('La contraseña es obligatoria');
        }
    }

    public static function registro(array $data): void
    {
        $nombre   = trim($data['nombre']   ?? '');
        $email    = trim($data['email']    ?? '');
        $password = trim($data['password'] ?? '');
        $telefono = trim($data['telefono'] ?? '');

        if (strlen($nombre) < 2 || strlen($nombre) > 100) {
            throw new \InvalidArgumentException('El nombre debe tener entre 2 y 100 caracteres');
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 100) {
            throw new \InvalidArgumentException('El correo no tiene un formato válido');
        }
        if (strlen($password) < 8 || strlen($password) > 72) {
            throw new \InvalidArgumentException('La contraseña debe tener entre 8 y 72 caracteres');
        }
        if ($telefono && !preg_match('/^\+?[\d\s\-]{7,20}$/', $telefono)) {
            throw new \InvalidArgumentException('El formato del teléfono no es válido');
        }
    }

    public static function recuperarPassword(array $data): void
    {
        $email = trim($data['email'] ?? '');
        if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException('El correo es obligatorio y debe ser válido');
        }
    }

    public static function nuevaPassword(array $data): void
    {
        if (empty($data['token'])) {
            throw new \InvalidArgumentException('El token es obligatorio');
        }
        $password = trim($data['password'] ?? '');
        if (strlen($password) < 8) {
            throw new \InvalidArgumentException('La contraseña debe tener al menos 8 caracteres');
        }
    }
}