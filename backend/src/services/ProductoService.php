<?php
namespace App\Services;

use App\Repositories\ProductoRepository;

class ProductoService
{
    private ProductoRepository $repo;

    public function __construct()
    {
        $this->repo = new ProductoRepository();
    }

    public function listar(string $categoria = ''): array
    {
        if ($categoria) {
            return $this->repo->findByCategoria($categoria);
        }
        return $this->repo->findAll();
    }
}