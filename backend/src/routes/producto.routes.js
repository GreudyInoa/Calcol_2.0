'use strict';

const { Router }                      = require('express');
const productoController              = require('../controllers/productoController');
const { authMiddleware, requireAdmin } = require('../middlewares/auth');
const { body }                        = require('express-validator');
const validate                        = require('../middlewares/validate');

const router = Router();

const productoRules = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 100 }).withMessage('Máximo 100 caracteres'),
  body('precio').isInt({ min: 1 }).withMessage('El precio debe ser un entero mayor a 0'),
  body('categoria_id').isInt({ min: 1 }).withMessage('categoria_id debe ser un entero válido'),
  body('descripcion').optional().isString(),
  body('imagen').optional().isString(),
  body('disponible').optional().isBoolean(),
];

router.get('/categorias', productoController.listarCategorias);
router.get('/',           productoController.listar);
router.get('/:id',        productoController.obtener);

router.post('/',    authMiddleware, requireAdmin, productoRules, validate, productoController.crear);
router.put('/:id',  authMiddleware, requireAdmin, productoRules, validate, productoController.actualizar);
router.delete('/:id', authMiddleware, requireAdmin, productoController.eliminar);

module.exports = router;