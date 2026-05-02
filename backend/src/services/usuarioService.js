'use strict';

const { Usuario, Pedido, DetallePedido, Producto, Categoria } = require('../models');

const editar = async (usuarioId, { nombre, telefono }) => {
  const usuario = await Usuario.findByPk(usuarioId);
  if (!usuario) {
    throw Object.assign(new Error('Usuario no encontrado'), { status: 404 });
  }

  const updates = { nombre: nombre.trim() };
  if (telefono) updates.telefono = telefono.trim();

  await usuario.update(updates);

  const actualizado = await Usuario.findByPk(usuarioId);
  return {
    id:       actualizado.id,
    nombre:   actualizado.nombre,
    email:    actualizado.email,
    telefono: actualizado.telefono,
    rol:      actualizado.rol,
  };
};

const eliminar = async (usuarioId) => {
  const pedidosActivos = await Pedido.scope('activos').count({ where: { usuario_id: usuarioId } });

  if (pedidosActivos > 0) {
    throw Object.assign(
      new Error('Tienes un pedido en curso. No puedes eliminar tu cuenta hasta que sea completado.'),
      { status: 400 }
    );
  }

  await Usuario.destroy({ where: { id: usuarioId } });
};

const obtenerHistorialPedidos = async (usuarioId) => {
  const pedidos = await Pedido.findAll({
    where:   { usuario_id: usuarioId },
    include: [{
      model:   DetallePedido,
      as:      'detalles',
      include: [{
        model:      Producto,
        as:         'producto',
        attributes: ['id', 'nombre', 'precio', 'imagen'],
        include:    [{ model: Categoria, as: 'categoria', attributes: ['id', 'nombre', 'slug'] }],
      }],
    }],
    order: [['creado_en', 'DESC']],
  });

  return pedidos;
};

module.exports = { editar, eliminar, obtenerHistorialPedidos };