<?php
namespace App\Services;

use App\Repositories\UsuarioRepository;
use App\Repositories\RecuperacionRepository;
use App\Validators\AuthValidator;

class AuthService
{
    private UsuarioRepository      $usuarioRepo;
    private RecuperacionRepository $recuperacionRepo;
    private JwtService             $jwt;
    private EmailService           $email;

    public function __construct()
    {
        $this->usuarioRepo      = new UsuarioRepository();
        $this->recuperacionRepo = new RecuperacionRepository();
        $this->jwt              = new JwtService();
        $this->email            = new EmailService();
    }

    public function login(array $data): array
    {
        AuthValidator::login($data);

        $usuario = $this->usuarioRepo->findByEmail(trim($data['email']));
        if (!$usuario || !password_verify(trim($data['password']), $usuario->password)) {
            throw new \DomainException('Usuario o contraseña incorrectos');
        }

        $token = $this->jwt->issue(['id' => $usuario->id, 'email' => $usuario->email, 'rol' => $usuario->rol]);

        return [
            'token'   => $token,
            'usuario' => [
                'id'       => $usuario->id,
                'nombre'   => $usuario->nombre,
                'email'    => $usuario->email,
                'telefono' => $usuario->telefono,
                'rol'      => $usuario->rol,
            ],
        ];
    }

    public function registro(array $data): array
    {
        AuthValidator::registro($data);

        $email = trim($data['email']);
        if ($this->usuarioRepo->emailExists($email)) {
            throw new \DomainException('Este correo ya está registrado');
        }

        $usuario = $this->usuarioRepo->create([
            'nombre'   => trim($data['nombre']),
            'email'    => $email,
            'password' => trim($data['password']),
            'telefono' => trim($data['telefono'] ?? ''),
        ]);

        $token = $this->jwt->issue(['id' => $usuario->id, 'email' => $usuario->email, 'rol' => $usuario->rol]);

        return [
            'token'   => $token,
            'usuario' => [
                'id'       => $usuario->id,
                'nombre'   => $usuario->nombre,
                'email'    => $usuario->email,
                'telefono' => $usuario->telefono,
                'rol'      => $usuario->rol,
            ],
        ];
    }

    public function recuperarPassword(array $data): void
    {
        AuthValidator::recuperarPassword($data);

        $usuario = $this->usuarioRepo->findByEmail(trim($data['email']));
        if (!$usuario) return;

        $token = bin2hex(random_bytes(32));
        $this->recuperacionRepo->create($usuario->id, $token);

        $appUrl = rtrim($_ENV['APP_URL'] ?? 'http://localhost/Calcol_2.0', '/');
        $link   = $appUrl . '/pages/nueva-password.html?token=' . $token;
        $this->email->enviarRecuperacion($usuario->email, $link);
    }

    public function nuevaPassword(array $data): void
    {
        AuthValidator::nuevaPassword($data);

        $recuperacion = $this->recuperacionRepo->findValidToken(trim($data['token']));
        if (!$recuperacion) {
            throw new \DomainException('El link es inválido o ha expirado');
        }

        $this->usuarioRepo->updateById($recuperacion->usuario_id, [
            'password' => password_hash(trim($data['password']), PASSWORD_DEFAULT),
        ]);
        $this->recuperacionRepo->markUsed(trim($data['token']));
    }
}