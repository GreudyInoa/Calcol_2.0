<?php
declare(strict_types=1);

require_once __DIR__ . '/../vendor/autoload.php';

use App\Config\Database;
use App\Utils\Response;
use App\Middleware\CorsMiddleware;
use App\Middleware\AuthMiddleware;
use App\Controllers\AuthController;
use App\Controllers\ProductoController;
use App\Controllers\PedidoController;
use App\Controllers\UsuarioController;

Database::boot();
CorsMiddleware::handle();

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$prefix = '/Calcol_2.0/backend/public';
if (str_starts_with($uri, $prefix)) {
    $uri = substr($uri, strlen($prefix));
}
$uri = '/' . trim($uri, '/');

$routes = [
    ['GET',    '#^/?$#',                           [],       fn() => Response::success(['status' => 'ok', 'version' => '2.0'])],
    ['POST',   '#^/api/auth/login$#',              [],       [AuthController::class,    'login']],
    ['POST',   '#^/api/auth/registro$#',           [],       [AuthController::class,    'registro']],
    ['POST',   '#^/api/auth/recuperar-password$#', [],       [AuthController::class,    'recuperarPassword']],
    ['POST',   '#^/api/auth/nueva-password$#',     [],       [AuthController::class,    'nuevaPassword']],
    ['GET',    '#^/api/productos$#',               [],       [ProductoController::class,'listar']],
    ['POST',   '#^/api/pedidos$#',                 ['auth'], [PedidoController::class,  'crear']],
    ['PUT',    '#^/api/usuarios/me$#',             ['auth'], [UsuarioController::class, 'editar']],
    ['DELETE', '#^/api/usuarios/me$#',             ['auth'], [UsuarioController::class, 'eliminar']],
];

$matched = false;
foreach ($routes as [$routeMethod, $pattern, $middlewares, $handler]) {
    if ($method !== $routeMethod) continue;
    if (!preg_match($pattern, $uri)) continue;

    $matched = true;
    $body = json_decode(file_get_contents('php://input'), true) ?? [];
    $request = array_merge($body, ['_query' => $_GET]);

    foreach ($middlewares as $mw) {
        if ($mw === 'auth') {
            $request = AuthMiddleware::handle($request);
        }
    }

    if (is_callable($handler)) {
        $handler();
    } else {
        [$class, $method2] = $handler;
        (new $class())->$method2($request);
    }
    break;
}

if (!$matched) {
    Response::notFound('Ruta no encontrada');
}