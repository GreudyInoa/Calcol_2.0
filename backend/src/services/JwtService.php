<?php
namespace App\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\SignatureInvalidException;

class JwtService
{
    private string $secret;
    private string $algo = 'HS256';
    private int $ttl;

    public function __construct()
    {
        $this->secret = $_ENV['JWT_SECRET'] ?? 'calcol_secret_change_me';
        $this->ttl    = (int) ($_ENV['JWT_TTL'] ?? 86400);
    }

    public function issue(array $payload): string
    {
        $now  = time();
        $data = array_merge($payload, ['iat' => $now, 'exp' => $now + $this->ttl]);
        return JWT::encode($data, $this->secret, $this->algo);
    }

    public function verify(string $token): array
    {
        try {
            $decoded = JWT::decode($token, new Key($this->secret, $this->algo));
            return (array) $decoded;
        } catch (ExpiredException) {
            throw new \RuntimeException('Token expirado');
        } catch (\Exception) {
            throw new \RuntimeException('Token inválido');
        }
    }
}