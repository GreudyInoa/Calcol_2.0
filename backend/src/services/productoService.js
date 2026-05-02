'use strict';

const { Producto, Categoria, Inventario } = require('../models');
const { fn, literal }                     = require('sequelize');

const calcularStock = async (productoId) => {
  const result = await Inventario.findOne({
    attributes: [
      [
        fn('SUM', literal(`CASE WHEN tipo = 'entrada' THEN cantidad ELSE -cantidad END`)),
        'stock',
      ],
    ],
    where: { producto_id: productoId },
    raw:   true,
  });
  return parseInt(result?.stock || 0, 10);
};

const listar = async ({ categoria, pagina = 1, porPagina = 50 }) => {
  const where   = { disponible: true };
  const include = [{
    model:      Categoria,
    as:         'categoria',
    attributes: ['id', 'nombre', 'slug'],
    ...(categoria ? { where: { slug: categoria } } : {}),
    required: !!categoria,
  }];

  const offset = (pagina - 1) * porPagina;

  const { count, rows } = await Producto.findAndCountAll({
    where,
    include,
    limit:  porPagina,
    offset,
    order:  [['nombre', 'ASC']],
  });

  return {
    productos:  rows,
    total:      count,
    pagina,
    por_pagina: porPagina,
    paginas:    Math.ceil(count / porPagina),
  };
};

const obtenerPorId = async (id) => {
  const producto = await Producto.findOne({
    where:   { id, disponible: true },
    include: [{ model: Categoria, as: 'categoria', attributes: ['id', 'nombre', 'slug'] }],
  });
  if (!producto) {
    throw Object.assign(new Error('Producto no encontrado'), { status: 404 });
  }
  return producto;
};

const listarCategorias = async () => {
  return Categoria.findAll({ order: [['nombre', 'ASC']] });
};

const crearProducto = async (datos) => {
  const { nombre, descripcion, precio, categoria_id, imagen, disponible } = datos;

  const categoria = await Categoria.findByPk(categoria_id);
  if (!categoria) {
    throw Object.assign(new Error('La categoría especificada no existe'), { status: 400 });
  }

  const producto = await Producto.create({ nombre, descripcion, precio, categoria_id, imagen, disponible });
  return Producto.findByPk(producto.id, {
    include: [{ model: Categoria, as: 'categoria', attributes: ['id', 'nombre', 'slug'] }],
  });
};

const actualizarProducto = async (id, datos) => {
  const producto = await Producto.findByPk(id);
  if (!producto) {
    throw Object.assign(new Error('Producto no encontrado'), { status: 404 });
  }

  if (datos.categoria_id) {
    const categoria = await Categoria.findByPk(datos.categoria_id);
    if (!categoria) {
      throw Object.assign(new Error('La categoría especificada no existe'), { status: 400 });
    }
  }

  await producto.update(datos);
  return Producto.findByPk(id, {
    include: [{ model: Categoria, as: 'categoria', attributes: ['id', 'nombre', 'slug'] }],
  });
};

const eliminarProducto = async (id) => {
  const producto = await Producto.findByPk(id);
  if (!producto) {
    throw Object.assign(new Error('Producto no encontrado'), { status: 404 });
  }
  await producto.update({ disponible: false });
};

module.exports = { listar, obtenerPorId, listarCategorias, calcularStock, crearProducto, actualizarProducto, eliminarProducto };