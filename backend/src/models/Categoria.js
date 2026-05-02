'use strict';

const { DataTypes } = require('sequelize');
const sequelize      = require('../config/database');

const Categoria = sequelize.define('Categoria', {
  id: {
    type:          DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey:    true,
  },
  nombre: {
    type:      DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre de la categoría no puede estar vacío' },
    },
  },
  slug: {
    type:      DataTypes.STRING(50),
    allowNull: false,
    unique:    true,
    validate: {
      is: { args: /^[a-z0-9-]+$/, msg: 'El slug solo puede contener letras minúsculas, números y guiones' },
    },
  },
}, {
  tableName:  'categorias',
  timestamps: false,
});

Categoria.associate = (models) => {
  Categoria.hasMany(models.Producto, {
    foreignKey: 'categoria_id',
    as:         'productos',
  });
};

module.exports = Categoria;