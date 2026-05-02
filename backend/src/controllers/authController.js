'use strict';

const authService = require('../services/authService');
const Response    = require('../utils/response');

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return Response.success(res, result, 'Sesión iniciada correctamente');
  } catch (err) {
    if (err.status) return Response.error(res, err.message, err.status);
    return next(err);
  }
};

const registro = async (req, res, next) => {
  try {
    const result = await authService.registro(req.body);
    return Response.success(res, result, 'Cuenta creada correctamente', 201);
  } catch (err) {
    if (err.status) return Response.error(res, err.message, err.status);
    return next(err);
  }
};

const recuperarPassword = async (req, res, next) => {
  try {
    await authService.recuperarPassword(req.body);
    return Response.success(res, {}, '');
  } catch (err) {
    return Response.success(res, {}, '');
  }
};

const nuevaPassword = async (req, res, next) => {
  try {
    await authService.nuevaPassword(req.body);
    return Response.success(res, {}, 'Contraseña actualizada correctamente');
  } catch (err) {
    if (err.status) return Response.error(res, err.message, err.status);
    return next(err);
  }
};

module.exports = { login, registro, recuperarPassword, nuevaPassword };