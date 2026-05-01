<?php
namespace App\Repositories;

use App\Models\Usuario;

class UsuarioRepository
{
    public function findByEmail(string $email): ?Usuario { return Usuario::where('email', $email)->first(); }
    public function findById(int $id): ?Usuario { return Usuario::find($id); }
    public function emailExists(string $email): bool { return Usuario::where('email', $email)->exists(); }

    public function create(array $data): Usuario
    {
        return Usuario::create([
            'nombre'   => $data['nombre'],
            'email'    => $data['email'],
            'password' => password_hash($data['password'], PASSWORD_DEFAULT),
            'telefono' => $data['telefono'] ?? null,
            'rol'      => 'cliente',
        ]);
    }

    public function updateById(int $id, array $data): bool { return (bool) Usuario::where('id', $id)->update($data); }
    public function deleteById(int $id): bool { return (bool) Usuario::where('id', $id)->delete(); }
}