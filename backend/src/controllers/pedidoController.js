'use strict';

const pedidoService = require('../services/pedidoService');
const Response      = require('../utils/response');

const crear = async (req, res, next) => {
  try {
    const pedido = await pedidoService.crear(req.authUser.id, req.body);
    return Response.success(res, { pedido_id: pedido.id }, 'Pedido creado correctamente', 201);
  } catch (err) {
    if (err.status) return Response.error(res, err.message, err.status);
    return next(err);
  }
};

const listar = async (req, res, next) => {
  try {
    const { estado, pagina, por_pagina } = req.query;
    const result = await pedidoService.listarTodos({
      estado:    estado || null,
      pagina:    parseInt(pagina || '1', 10),
      porPagina: parseInt(por_pagina || '20', 10),
    });
    return Response.success(res, result);
  } catch (err) {
    return next(err);
  }
};

const actualizarEstado = async (req, res, next) => {
  try {
    const pedido = await pedidoService.actualizarEstado(req.params.id, req.body.estado);
    return Response.success(res, { pedido }, 'Estado actualizado correctamente');
  } catch (err) {
    if (err.status) return Response.error(res, err.message, err.status);
    return next(err);
  }
};

module.exports = { crear, listar, actualizarEstado };