'use strict';

const usuarioService = require('../services/usuarioService');
const Response       = require('../utils/response');

const editar = async (req, res, next) => {
  try {
    const usuario = await usuarioService.editar(req.authUser.id, req.body);
    return Response.success(res, { usuario }, 'Perfil actualizado correctamente');
  } catch (err) {
    if (err.status) return Response.error(res, err.message, err.status);
    return next(err);
  }
};

const eliminar = async (req, res, next) => {
  try {
    await usuarioService.eliminar(req.authUser.id);
    return Response.success(res, {}, 'Cuenta eliminada correctamente');
  } catch (err) {
    if (err.status) return Response.error(res, err.message, err.status);
    return next(err);
  }
};

const historialPedidos = async (req, res, next) => {
  try {
    const pedidos = await usuarioService.obtenerHistorialPedidos(req.authUser.id);
    return Response.success(res, { pedidos });
  } catch (err) {
    return next(err);
  }
};

module.exports = { editar, eliminar, historialPedidos };