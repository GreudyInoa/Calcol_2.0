'use strict';

const { Router }                      = require('express');
const pedidoController                = require('../controllers/pedidoController');
const { authMiddleware, requireAdmin } = require('../middlewares/auth');
const { crearPedidoRules }            = require('../validators/pedidoValidator');
const { body }                        = require('express-validator');
const validate                        = require('../middlewares/validate');

const router = Router();

router.use(authMiddleware);

router.post('/',              crearPedidoRules, validate, pedidoController.crear);
router.get('/',               requireAdmin,               pedidoController.listar);
router.patch('/:id/estado',   requireAdmin,
  [body('estado').notEmpty().withMessage('El estado es obligatorio')],
  validate, pedidoController.actualizarEstado
);

module.exports = router;