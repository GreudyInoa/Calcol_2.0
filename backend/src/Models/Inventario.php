<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inventario extends Model
{
    protected $table    = 'inventario';
    const CREATED_AT    = 'fecha';
    const UPDATED_AT    = null;
    protected $fillable = ['producto_id','pedido_id','tipo','cantidad','motivo'];

    public function producto() { return $this->belongsTo(Producto::class, 'producto_id'); }
    public function pedido() { return $this->belongsTo(Pedido::class, 'pedido_id'); }
}