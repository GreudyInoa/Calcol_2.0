<?php
require_once __DIR__ . '/../../vendor/PHPMailer/src/Exception.php';
require_once __DIR__ . '/../../vendor/PHPMailer/src/PHPMailer.php';
require_once __DIR__ . '/../../vendor/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class EmailService {
    private string $mailUser;
    private string $mailPass;

    public function __construct(array $env) {
        $this->mailUser = $env['MAIL_USER'] ?? '';
        $this->mailPass = $env['MAIL_PASS'] ?? '';
    }

    public function enviarRecuperacion(string $email, string $link): bool {
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = $this->mailUser;
        $mail->Password   = $this->mailPass;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;
        $mail->CharSet    = 'UTF-8';
        $mail->setFrom($this->mailUser, 'Calcol');
        $mail->addAddress($email);
        $mail->isHTML(true);
        $mail->Subject = 'Recupera tu contraseña — Calcol';
        $mail->Body    = "
            <div style='font-family:Arial,sans-serif;max-width:500px;margin:0 auto;background:#1a0500;color:#fff;border-radius:16px;padding:32px;'>
                <h2 style='color:#FFD700;font-size:28px;margin-bottom:8px;'>CALCOL</h2>
                <h3 style='color:#fff;margin-bottom:16px;'>Recupera tu contraseña</h3>
                <p style='color:rgba(255,255,255,0.7);line-height:1.6;'>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
                <a href='{$link}' style='display:inline-block;margin:24px 0;background:#FFD700;color:#111;font-weight:800;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:16px;'>Cambiar contraseña</a>
                <p style='color:rgba(255,255,255,0.4);font-size:13px;'>Este link expira en 1 hora. Si no solicitaste este cambio, ignora este email.</p>
            </div>
        ";
        $mail->send();
        return true;
    }
}