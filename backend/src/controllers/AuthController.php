<?php
namespace App\Controllers;

use App\Services\ProductoService;
use App\Utils\Response;

class ProductoController
{
    public function listar(array $request): void
    {
        try {
            $categoria = trim($request['_query']['categoria'] ?? '');
            $service   = new ProductoService();
            Response::success(['productos' => $service->listar($categoria)]);
        } catch (\Throwable $e) {
            error_log('[Producto] ' . $e->getMessage());
            Response::serverError();
        }
    }
}