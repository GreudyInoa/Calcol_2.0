<?php
require_once __DIR__ . '/../src/middleware/cors.php';
require_once __DIR__ . '/../src/config/database.php';
require_once __DIR__ . '/../src/utils/Response.php';
require_once __DIR__ . '/../src/controllers/ProductoController.php';

applyCorsHeaders('GET');
ProductoController::listar($pdo);