'use strict';

const { Router }          = require('express');
const usuarioController   = require('../controllers/usuarioController');
const { authMiddleware }  = require('../middlewares/auth');
const validate            = require('../middlewares/validate');
const { editarPerfilRules } = require('../validators/usuarioValidator');

const router = Router();

router.use(authMiddleware);

router.get('/me/pedidos', usuarioController.historialPedidos);
router.put('/me',         editarPerfilRules, validate, usuarioController.editar);
router.delete('/me',      usuarioController.eliminar);

module.exports = router;