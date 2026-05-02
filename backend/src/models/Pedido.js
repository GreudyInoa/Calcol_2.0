'use strict';

const { DataTypes } = require('sequelize');
const sequelize      = require('../config/database');

const Pedido = sequelize.define('Pedido', {
  id: {
    type:          DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey:    true,
  },
  usuario_id: {
    type:      DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
  },
  direccion: {
    type:      DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len:      { args: [5, 255], msg: 'La dirección debe tener entre 5 y 255 caracteres' },
      notEmpty: { msg: 'La dirección no puede estar vacía' },
    },
  },
  instrucciones: {
    type:         DataTypes.TEXT,
    allowNull:    true,
    defaultValue: '',
  },
  subtotal: {
    type:      DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    validate: { min: { args: [0], msg: 'El subtotal no puede ser negativo' } },
  },
  envio: {
    type:         DataTypes.INTEGER.UNSIGNED,
    allowNull:    false,
    defaultValue: 2000,
  },
  total: {
    type:      DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    validate: { min: { args: [0], msg: 'El total no puede ser negativo' } },
  },
  estado: {
    type:         DataTypes.ENUM('pendiente', 'en_proceso', 'listo', 'entregado', 'cancelado'),
    allowNull:    false,
    defaultValue: 'pendiente',
  },
  cubiertos: {
    type:         DataTypes.BOOLEAN,
    allowNull:    false,
    defaultValue: false,
  },
  salsa: {
    type:         DataTypes.BOOLEAN,
    allowNull:    false,
    defaultValue: false,
  },
  metodo_pago: {
    type:         DataTypes.ENUM('efectivo', 'tarjeta'),
    allowNull:    false,
    defaultValue: 'efectivo',
  },
}, {
  tableName:  'pedidos',
  timestamps: true,
  createdAt:  'creado_en',
  updatedAt:  'actualizado_en',
  scopes: {
    activos: {
      where: { estado: ['pendiente', 'en_proceso', 'listo'] },
    },
  },
});

Pedido.associate = (models) => {
  Pedido.belongsTo(models.Usuario, {
    foreignKey: 'usuario_id',
    as:         'usuario',
  });
  Pedido.hasMany(models.DetallePedido, {
    foreignKey: 'pedido_id',
    as:         'detalles',
  });
  Pedido.hasMany(models.Inventario, {
    foreignKey: 'pedido_id',
    as:         'movimientos',
  });
};

module.exports = Pedido;