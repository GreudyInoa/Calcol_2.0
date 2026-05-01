<?php
namespace App\Repositories;

use Illuminate\Database\Capsule\Manager as Capsule;

class RecuperacionRepository
{
    public function create(int $usuarioId, string $token): void
    {
        Capsule::table('recuperacion_password')->where('usuario_id', $usuarioId)->delete();
        Capsule::table('recuperacion_password')->insert([
            'usuario_id' => $usuarioId,
            'token'      => $token,
            'expiracion' => date('Y-m-d H:i:s', strtotime('+1 hour')),
            'usado'      => 0,
            'creado_en'  => date('Y-m-d H:i:s'),
        ]);
    }

    public function findValidToken(string $token): ?object
    {
        return Capsule::table('recuperacion_password')
            ->where('token', $token)
            ->where('usado', 0)
            ->where('expiracion', '>', date('Y-m-d H:i:s'))
            ->first();
    }

    public function markUsed(string $token): void
    {
        Capsule::table('recuperacion_password')->where('token', $token)->update(['usado' => 1]);
    }
}