'use strict';

const { body } = require('express-validator');

const editarPerfilRules = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),

  body('telefono')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .matches(/^\+?[\d\s\-]{7,20}$/).withMessage('El formato del teléfono no es válido'),
];

module.exports = { editarPerfilRules };