'use strict';

const { body } = require('express-validator');

const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('El correo es obligatorio')
    .isEmail().withMessage('El correo no tiene un formato válido')
    .isLength({ max: 100 }).withMessage('El correo es demasiado largo'),

  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria'),
];

const registroRules = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),

  body('email')
    .trim()
    .notEmpty().withMessage('El correo es obligatorio')
    .isEmail().withMessage('El correo no tiene un formato válido')
    .isLength({ max: 100 }).withMessage('El correo es demasiado largo'),

  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 8, max: 72 }).withMessage('La contraseña debe tener entre 8 y 72 caracteres'),

  body('telefono')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .matches(/^\+?[\d\s\-]{7,20}$/).withMessage('El formato del teléfono no es válido'),
];

const recuperarPasswordRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('El correo es obligatorio')
    .isEmail().withMessage('El correo no tiene un formato válido'),
];

const nuevaPasswordRules = [
  body('token')
    .trim()
    .notEmpty().withMessage('El token es obligatorio'),

  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
];

module.exports = { loginRules, registroRules, recuperarPasswordRules, nuevaPasswordRules };