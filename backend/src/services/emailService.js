'use strict';

const transporter = require('../config/email');

const enviarRecuperacion = async (email, link) => {
  const fromName    = process.env.MAIL_FROM_NAME    || 'Calcol';
  const fromAddress = process.env.MAIL_FROM_ADDRESS || process.env.MAIL_USER;

  await transporter.sendMail({
    from:    `"${fromName}" <${fromAddress}>`,
    to:      email,
    subject: 'Recupera tu contraseña — Calcol',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;
                  background:#1a0500;color:#fff;border-radius:16px;padding:32px;">
        <h2 style="color:#FFD700;">CALCOL</h2>
        <h3>Recupera tu contraseña</h3>
        <p style="color:rgba(255,255,255,0.7);">
          Recibimos una solicitud para restablecer la contraseña de tu cuenta.
        </p>
        <a href="${link}"
           style="display:inline-block;margin:24px 0;background:#FFD700;color:#111;
                  font-weight:800;padding:14px 32px;border-radius:10px;text-decoration:none;">
          Cambiar contraseña
        </a>
        <p style="color:rgba(255,255,255,0.4);font-size:13px;">
          Este link expira en 1 hora. Si no solicitaste este cambio, ignora este correo.
        </p>
      </div>
    `,
  });
};

module.exports = { enviarRecuperacion };