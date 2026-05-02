'use strict';

const bcrypt               = require('bcryptjs');
const crypto               = require('crypto');
const { Op }               = require('sequelize');
const { Usuario, RecuperacionPassword } = require('../models');
const jwtService           = require('./jwtService');
const emailService         = require('./emailService');

const formatearUsuario = (usuario) => ({
  id:       usuario.id,
  nombre:   usuario.nombre,
  email:    usuario.email,
  telefono: usuario.telefono || null,
  rol:      usuario.rol,
});

const login = async ({ email, password }) => {
  const usuario = await Usuario.scope('withPassword').findOne({
    where: { email: email.trim().toLowerCase() },
  });

  if (!usuario) {
    throw Object.assign(new Error('Usuario o contraseña incorrectos'), { status: 401 });
  }

  const passwordValido = await bcrypt.compare(password, usuario.password);
  if (!passwordValido) {
    throw Object.assign(new Error('Usuario o contraseña incorrectos'), { status: 401 });
  }

  const token = jwtService.issue({ id: usuario.id, email: usuario.email, rol: usuario.rol });

  return { token, usuario: formatearUsuario(usuario) };
};

const registro = async ({ nombre, email, password, telefono }) => {
  const emailNormalizado = email.trim().toLowerCase();

  const existe = await Usuario.findOne({ where: { email: emailNormalizado } });
  if (existe) {
    throw Object.assign(new Error('Este correo ya está registrado'), { status: 409 });
  }

  const hash = await bcrypt.hash(password, 12);

  const usuario = await Usuario.create({
    nombre:   nombre.trim(),
    email:    emailNormalizado,
    password: hash,
    telefono: telefono ? telefono.trim() : null,
    rol:      'cliente',
  });

  const usuarioCompleto = await Usuario.findByPk(usuario.id);
  const token = jwtService.issue({ id: usuarioCompleto.id, email: usuarioCompleto.email, rol: usuarioCompleto.rol });

  return { token, usuario: formatearUsuario(usuarioCompleto) };
};

const recuperarPassword = async ({ email }) => {
  const emailNormalizado = email.trim().toLowerCase();
  const usuario = await Usuario.findOne({ where: { email: emailNormalizado } });

  if (!usuario) return;

  const token      = crypto.randomBytes(32).toString('hex');
  const expiracion = new Date(Date.now() + 60 * 60 * 1000);

  await RecuperacionPassword.destroy({ where: { usuario_id: usuario.id } });

  await RecuperacionPassword.create({
    usuario_id: usuario.id,
    token,
    expiracion,
    usado: false,
  });

  const appUrl = process.env.APP_URL || 'http://localhost';
  const link   = `${appUrl}/pages/nueva-password.html?token=${token}`;

  await emailService.enviarRecuperacion(emailNormalizado, link);
};

const nuevaPassword = async ({ token, password }) => {
  const recuperacion = await RecuperacionPassword.findOne({
    where: {
      token,
      usado:      false,
      expiracion: { [Op.gt]: new Date() },
    },
  });

  if (!recuperacion) {
    throw Object.assign(new Error('El link es inválido o ha expirado'), { status: 400 });
  }

  const hash = await bcrypt.hash(password, 12);

  await Usuario.update({ password: hash }, { where: { id: recuperacion.usuario_id } });

  await recuperacion.update({ usado: true });
};

module.exports = { login, registro, recuperarPassword, nuevaPassword };