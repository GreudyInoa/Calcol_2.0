<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $table    = 'productos';
    const CREATED_AT    = 'creado_en';
    const UPDATED_AT    = 'actualizado_en';
    protected $fillable = ['nombre', 'descripcion', 'precio', 'categoria_id', 'imagen', 'disponible'];

    public function scopeDisponible($query) { return $query->where('disponible', 1); }
    public function categoria() { return $this->belongsTo(Categoria::class, 'categoria_id'); }
    public function inventario() { return $this->hasMany(Inventario::class, 'producto_id'); }
}