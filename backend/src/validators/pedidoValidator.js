'use strict';

const { body } = require('express-validator');

const crearPedidoRules = [
  body('direccion')
    .trim()
    .notEmpty().withMessage('La dirección es obligatoria')
    .isLength({ min: 5, max: 255 }).withMessage('La dirección debe tener entre 5 y 255 caracteres'),

  body('instrucciones')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 500 }).withMessage('Las instrucciones no pueden superar los 500 caracteres'),

  body('metodo_pago')
    .optional()
    .isIn(['efectivo', 'tarjeta']).withMessage('El método de pago debe ser efectivo o tarjeta'),

  body('cubiertos')
    .optional()
    .isBoolean().withMessage('El campo cubiertos debe ser un booleano'),

  body('salsa')
    .optional()
    .isBoolean().withMessage('El campo salsa debe ser un booleano'),

  body('items')
    .isArray({ min: 1 }).withMessage('El pedido debe tener al menos un producto'),

  body('items.*.producto_id')
    .isInt({ min: 1 }).withMessage('producto_id inválido en uno de los ítems'),

  body('items.*.cantidad')
    .isInt({ min: 1, max: 99 }).withMessage('La cantidad de cada ítem debe estar entre 1 y 99'),

  body('items.*.nota')
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .isLength({ max: 255 }).withMessage('La nota de un ítem no puede superar los 255 caracteres'),
];

module.exports = { crearPedidoRules };