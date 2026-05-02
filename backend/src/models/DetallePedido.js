'use strict';

const { DataTypes } = require('sequelize');
const sequelize      = require('../config/database');

const DetallePedido = sequelize.define('DetallePedido', {
  id: {
    type:          DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey:    true,
  },
  pedido_id: {
    type:      DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  producto_id: {
    type:      DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  cantidad: {
    type:      DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    validate: {
      min: { args: [1],  msg: 'La cantidad mínima es 1' },
      max: { args: [99], msg: 'La cantidad máxima es 99' },
    },
  },
  precio_unitario: {
    type:      DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    validate: { min: { args: [1], msg: 'El precio unitario debe ser mayor a 0' } },
  },
  nota: {
    type:         DataTypes.STRING(255),
    allowNull:    true,
    defaultValue: '',
  },
}, {
  tableName:  'detalle_pedidos',
  timestamps: false,
});

DetallePedido.associate = (models) => {
  DetallePedido.belongsTo(models.Pedido, {
    foreignKey: 'pedido_id',
    as:         'pedido',
  });
  DetallePedido.belongsTo(models.Producto, {
    foreignKey: 'producto_id',
    as:         'producto',
  });
};

module.exports = DetallePedido;