<?php
namespace App\Config;

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Events\Dispatcher;
use Illuminate\Container\Container;
use Dotenv\Dotenv;

class Database
{
    private static bool $booted = false;

    public static function boot(): void
    {
        if (self::$booted) return;

        $dotenv = Dotenv::createImmutable(__DIR__ . '/../../../');
        $dotenv->load();

        $capsule = new Capsule;
        $capsule->addConnection([
            'driver'    => 'mysql',
            'host'      => $_ENV['DB_HOST']    ?? 'localhost',
            'database'  => $_ENV['DB_NAME']    ?? 'calcol',
            'username'  => $_ENV['DB_USER']    ?? 'root',
            'password'  => $_ENV['DB_PASS']    ?? '',
            'charset'   => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix'    => '',
        ]);

        $capsule->setEventDispatcher(new Dispatcher(new Container));
        $capsule->setAsGlobal();
        $capsule->bootEloquent();

        self::$booted = true;
    }
}