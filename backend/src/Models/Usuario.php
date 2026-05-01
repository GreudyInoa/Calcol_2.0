<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    protected $table      = 'usuarios';
    const CREATED_AT      = 'creado_en';
    const UPDATED_AT      = 'actualizado_en';
    protected $fillable   = ['nombre', 'email', 'password', 'telefono', 'rol'];
    protected $hidden     = ['password'];

    public function pedidos() { return $this->hasMany(Pedido::class, 'usuario_id'); }
}