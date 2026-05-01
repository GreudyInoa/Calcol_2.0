<?php
namespace App\Services;

use PHPMailer\PHPMailer\PHPMailer;

class EmailService
{
    public function enviarRecuperacion(string $email, string $link): void
    {
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = $_ENV['MAIL_USER'] ?? '';
        $mail->Password   = $_ENV['MAIL_PASS'] ?? '';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;
        $mail->CharSet    = 'UTF-8';
        $mail->setFrom($_ENV['MAIL_USER'] ?? '', 'Calcol');
        $mail->addAddress($email);
        $mail->isHTML(true);
        $mail->Subject = 'Recupera tu contraseña — Calcol';
        $mail->Body    = "
            <div style='font-family:Arial,sans-serif;max-width:500px;margin:0 auto;
                        background:#1a0500;color:#fff;border-radius:16px;padding:32px;'>
                <h2 style='color:#FFD700;'>CALCOL</h2>
                <h3>Recupera tu contraseña</h3>
                <p style='color:rgba(255,255,255,0.7);'>
                    Recibimos una solicitud para restablecer la contraseña de tu cuenta.
                </p>
                <a href='{$link}'
                   style='display:inline-block;margin:24px 0;background:#FFD700;color:#111;
                          font-weight:800;padding:14px 32px;border-radius:10px;text-decoration:none;'>
                    Cambiar contraseña
                </a>
                <p style='color:rgba(255,255,255,0.4);font-size:13px;'>
                    Este link expira en 1 hora.
                </p>
            </div>";
        $mail->send();
    }
}