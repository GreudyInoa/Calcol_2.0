<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    protected $table    = 'pedidos';
    const CREATED_AT    = 'creado_en';
    const UPDATED_AT    = 'actualizado_en';
    protected $fillable = ['usuario_id','direccion','instrucciones','subtotal','envio','total','estado','cubiertos','salsa','metodo_pago'];

    public function scopeActivos($query) { return $query->whereIn('estado', ['pendiente','en_proceso','listo']); }
    public function usuario() { return $this->belongsTo(Usuario::class, 'usuario_id'); }
    public function detalles() { return $this->hasMany(DetallePedido::class, 'pedido_id'); }
}