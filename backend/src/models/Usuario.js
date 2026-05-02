'use strict';

const { DataTypes } = require('sequelize');
const sequelize      = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: {
    type:          DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey:    true,
  },
  nombre: {
    type:      DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len:      { args: [2, 100], msg: 'El nombre debe tener entre 2 y 100 caracteres' },
      notEmpty: { msg: 'El nombre no puede estar vacío' },
    },
  },
  email: {
    type:      DataTypes.STRING(100),
    allowNull: false,
    unique:    true,
    validate: {
      isEmail:  { msg: 'El correo no tiene un formato válido' },
      len:      { args: [1, 100], msg: 'El correo es demasiado largo' },
      notEmpty: { msg: 'El correo no puede estar vacío' },
    },
  },
  password: {
    type:      DataTypes.STRING(255),
    allowNull: false,
  },
  telefono: {
    type:      DataTypes.STRING(20),
    allowNull: true,
    validate: {
      is: { args: /^\+?[\d\s\-]{7,20}$/, msg: 'El formato del teléfono no es válido' },
    },
  },
  rol: {
    type:         DataTypes.ENUM('admin', 'cliente'),
    allowNull:    false,
    defaultValue: 'cliente',
  },
}, {
  tableName:  'usuarios',
  timestamps: true,
  createdAt:  'creado_en',
  updatedAt:  'actualizado_en',
  defaultScope: {
    attributes: { exclude: ['password'] },
  },
  scopes: {
    withPassword: { attributes: {} },
  },
});

Usuario.associate = (models) => {
  Usuario.hasMany(models.Pedido, {
    foreignKey: 'usuario_id',
    as:         'pedidos',
  });
  Usuario.hasMany(models.RecuperacionPassword, {
    foreignKey: 'usuario_id',
    as:         'recuperaciones',
  });
};

module.exports = Usuario;