'use strict';

const { sequelize, Pedido, DetallePedido, Producto, Inventario } = require('../models');
const { fn, literal } = require('sequelize');

const COSTO_ENVIO = 2000;

const calcularStock = async (productoId, transaction) => {
  const result = await Inventario.findOne({
    attributes: [
      [
        fn('SUM', literal(`CASE WHEN tipo = 'entrada' THEN cantidad ELSE -cantidad END`)),
        'stock',
      ],
    ],
    where: { producto_id: productoId },
    raw:   true,
    transaction,
  });
  return parseInt(result?.stock || 0, 10);
};

const crear = async (usuarioId, datos) => {
  const { direccion, instrucciones, items, cubiertos, salsa, metodo_pago } = datos;

  const result = await sequelize.transaction(async (t) => {
    let subtotal = 0;
    const itemsConPrecio = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const n    = i + 1;

      const producto = await Producto.findOne({
        where:       { id: item.producto_id, disponible: true },
        transaction: t,
        lock:        t.LOCK.UPDATE,
      });

      if (!producto) {
        throw Object.assign(
          new Error(`Ítem #${n}: el producto #${item.producto_id} no existe o no está disponible`),
          { status: 400 }
        );
      }

      const stock = await calcularStock(producto.id, t);

      if (stock < item.cantidad) {
        throw Object.assign(
          new Error(`Stock insuficiente para "${producto.nombre}" (disponible: ${stock})`),
          { status: 400 }
        );
      }

      subtotal += producto.precio * item.cantidad;
      itemsConPrecio.push({ ...item, precio: producto.precio, nombre: producto.nombre });
    }

    const total = subtotal + COSTO_ENVIO;

    const pedido = await Pedido.create({
      usuario_id:    usuarioId,
      direccion:     direccion.trim(),
      instrucciones: (instrucciones || '').trim(),
      subtotal,
      envio:         COSTO_ENVIO,
      total,
      estado:        'pendiente',
      cubiertos:     !!cubiertos,
      salsa:         !!salsa,
      metodo_pago:   metodo_pago || 'efectivo',
    }, { transaction: t });

    for (const item of itemsConPrecio) {
      await DetallePedido.create({
        pedido_id:       pedido.id,
        producto_id:     item.producto_id,
        cantidad:        item.cantidad,
        precio_unitario: item.precio,
        nota:            item.nota || '',
      }, { transaction: t });

      await Inventario.create({
        producto_id: item.producto_id,
        pedido_id:   pedido.id,
        tipo:        'salida',
        cantidad:    item.cantidad,
        motivo:      `Pedido #${pedido.id}`,
        fecha:       new Date(),
      }, { transaction: t });
    }

    return pedido;
  });

  return result;
};

const listarTodos = async ({ estado, pagina = 1, porPagina = 20 }) => {
  const where  = {};
  if (estado) where.estado = estado;

  const offset = (pagina - 1) * porPagina;

  const { count, rows } = await Pedido.findAndCountAll({
    where,
    include: [{
      model:   DetallePedido,
      as:      'detalles',
      include: [{ model: Producto, as: 'producto', attributes: ['id', 'nombre', 'precio', 'imagen'] }],
    }],
    order:  [['creado_en', 'DESC']],
    limit:  porPagina,
    offset,
  });

  return { pedidos: rows, total: count, pagina, por_pagina: porPagina, paginas: Math.ceil(count / porPagina) };
};

const actualizarEstado = async (pedidoId, nuevoEstado) => {
  const estadosValidos = ['pendiente', 'en_proceso', 'listo', 'entregado', 'cancelado'];
  if (!estadosValidos.includes(nuevoEstado)) {
    throw Object.assign(new Error('Estado inválido'), { status: 400 });
  }

  const pedido = await Pedido.findByPk(pedidoId);
  if (!pedido) {
    throw Object.assign(new Error('Pedido no encontrado'), { status: 404 });
  }

  await pedido.update({ estado: nuevoEstado });
  return pedido;
};

module.exports = { crear, listarTodos, actualizarEstado };