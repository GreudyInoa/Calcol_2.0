'use strict';

const { DataTypes } = require('sequelize');
const sequelize      = require('../config/database');

const RecuperacionPassword = sequelize.define('RecuperacionPassword', {
  id: {
    type:          DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey:    true,
  },
  usuario_id: {
    type:      DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  token: {
    type:      DataTypes.STRING(64),
    allowNull: false,
    unique:    true,
  },
  expiracion: {
    type:      DataTypes.DATE,
    allowNull: false,
  },
  usado: {
    type:         DataTypes.BOOLEAN,
    allowNull:    false,
    defaultValue: false,
  },
}, {
  tableName:  'recuperacion_password',
  timestamps: true,
  createdAt:  'creado_en',
  updatedAt:  false,
});

RecuperacionPassword.associate = (models) => {
  RecuperacionPassword.belongsTo(models.Usuario, {
    foreignKey: 'usuario_id',
    as:         'usuario',
  });
};

module.exports = RecuperacionPassword;