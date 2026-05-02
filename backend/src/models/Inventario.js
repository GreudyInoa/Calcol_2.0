'use strict';

const { DataTypes } = require('sequelize');
const sequelize      = require('../config/database');

const Inventario = sequelize.define('Inventario', {
  id: {
    type:          DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey:    true,
  },
  producto_id: {
    type:      DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  pedido_id: {
    type:      DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
  },
  tipo: {
    type:      DataTypes.ENUM('entrada', 'salida'),
    allowNull: false,
  },
  cantidad: {
    type:      DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    validate: { min: { args: [1], msg: 'La cantidad debe ser mayor a 0' } },
  },
  motivo: {
    type:      DataTypes.STRING(255),
    allowNull: true,
  },
  fecha: {
    type:         DataTypes.DATE,
    allowNull:    false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName:  'inventario',
  timestamps: false,
});

Inventario.associate = (models) => {
  Inventario.belongsTo(models.Producto, {
    foreignKey: 'producto_id',
    as:         'producto',
  });
  Inventario.belongsTo(models.Pedido, {
    foreignKey: 'pedido_id',
    as:         'pedido',
  });
};

module.exports = Inventario;