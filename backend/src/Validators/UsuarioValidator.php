<?php
namespace App\Validators;

class UsuarioValidator
{
    public static function editar(array $data): void
    {
        $nombre   = trim($data['nombre']   ?? '');
        $telefono = trim($data['telefono'] ?? '');

        if (strlen($nombre) < 2 || strlen($nombre) > 100) {
            throw new \InvalidArgumentException('El nombre debe tener entre 2 y 100 caracteres');
        }
        if ($telefono && !preg_match('/^\+?[\d\s\-]{7,20}$/', $telefono)) {
            throw new \InvalidArgumentException('El formato del teléfono no es válido');
        }
    }
}