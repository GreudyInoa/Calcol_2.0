'use strict';

const productoService = require('../services/productoService');
const Response        = require('../utils/response');

const listar = async (req, res, next) => {
  try {
    const { categoria, pagina, por_pagina } = req.query;
    const result = await productoService.listar({
      categoria:  categoria || null,
      pagina:     parseInt(pagina || '1', 10),
      porPagina:  parseInt(por_pagina || '50', 10),
    });
    return Response.success(res, result);
  } catch (err) {
    return next(err);
  }
};

const obtener = async (req, res, next) => {
  try {
    const producto = await productoService.obtenerPorId(req.params.id);
    return Response.success(res, { producto });
  } catch (err) {
    if (err.status) return Response.error(res, err.message, err.status);
    return next(err);
  }
};

const listarCategorias = async (req, res, next) => {
  try {
    const categorias = await productoService.listarCategorias();
    return Response.success(res, { categorias });
  } catch (err) {
    return next(err);
  }
};

const crear = async (req, res, next) => {
  try {
    const producto = await productoService.crearProducto(req.body);
    return Response.success(res, { producto }, 'Producto creado correctamente', 201);
  } catch (err) {
    if (err.status) return Response.error(res, err.message, err.status);
    return next(err);
  }
};

const actualizar = async (req, res, next) => {
  try {
    const producto = await productoService.actualizarProducto(req.params.id, req.body);
    return Response.success(res, { producto }, 'Producto actualizado correctamente');
  } catch (err) {
    if (err.status) return Response.error(res, err.message, err.status);
    return next(err);
  }
};

const eliminar = async (req, res, next) => {
  try {
    await productoService.eliminarProducto(req.params.id);
    return Response.success(res, {}, 'Producto desactivado correctamente');
  } catch (err) {
    if (err.status) return Response.error(res, err.message, err.status);
    return next(err);
  }
};

module.exports = { listar, obtener, listarCategorias, crear, actualizar, eliminar };