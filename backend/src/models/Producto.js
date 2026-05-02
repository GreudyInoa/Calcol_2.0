'use strict';

const { DataTypes } = require('sequelize');
const sequelize      = require('../config/database');

const Producto = sequelize.define('Producto', {
  id: {
    type:          DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey:    true,
  },
  nombre: {
    type:      DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre del producto no puede estar vacío' },
      len:      { args: [1, 100], msg: 'El nombre debe tener entre 1 y 100 caracteres' },
    },
  },
  descripcion: {
    type:      DataTypes.TEXT,
    allowNull: true,
  },
  precio: {
    type:      DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    validate: {
      min: { args: [1], msg: 'El precio debe ser mayor a 0' },
    },
  },
  categoria_id: {
    type:      DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  imagen: {
    type:      DataTypes.STRING(255),
    allowNull: true,
  },
  disponible: {
    type:         DataTypes.BOOLEAN,
    allowNull:    false,
    defaultValue: true,
  },
}, {
  tableName:  'productos',
  timestamps: true,
  createdAt:  'creado_en',
  updatedAt:  'actualizado_en',
  scopes: {
    disponible: { where: { disponible: true } },
  },
});

Producto.associate = (models) => {
  Producto.belongsTo(models.Categoria, {
    foreignKey: 'categoria_id',
    as:         'categoria',
  });
  Producto.hasMany(models.DetallePedido, {
    foreignKey: 'producto_id',
    as:         'detalles',
  });
  Producto.hasMany(models.Inventario, {
    foreignKey: 'producto_id',
    as:         'movimientos',
  });
};

module.exports = Producto;