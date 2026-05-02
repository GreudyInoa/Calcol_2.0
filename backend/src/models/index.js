'use strict';

const sequelize            = require('../config/database');
const Usuario              = require('./Usuario');
const Categoria            = require('./Categoria');
const Producto             = require('./Producto');
const Pedido               = require('./Pedido');
const DetallePedido        = require('./DetallePedido');
const Inventario           = require('./Inventario');
const RecuperacionPassword = require('./RecuperacionPassword');

const models = {
  Usuario,
  Categoria,
  Producto,
  Pedido,
  DetallePedido,
  Inventario,
  RecuperacionPassword,
};

Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

module.exports = { sequelize, ...models };