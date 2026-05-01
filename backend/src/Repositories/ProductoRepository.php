<?php
namespace App\Repositories;

use App\Models\Producto;

class ProductoRepository
{
    public function findAll(): array
    {
        return Producto::disponible()->with('categoria:id,nombre,slug')->get()->toArray();
    }

    public function findByCategoria(string $slug): array
    {
        return Producto::disponible()
            ->whereHas('categoria', fn($q) => $q->where('slug', $slug))
            ->with('categoria:id,nombre,slug')
            ->get()->toArray();
    }

    public function findById(int $id): ?Producto { return Producto::find($id); }
}