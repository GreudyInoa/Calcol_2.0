'use strict';

const { Router }      = require('express');
const authController  = require('../controllers/authController');
const { authLimiter } = require('../middlewares/rateLimiter');
const validate        = require('../middlewares/validate');
const {
  loginRules,
  registroRules,
  recuperarPasswordRules,
  nuevaPasswordRules,
} = require('../validators/authValidator');

const router = Router();

router.post('/login',              authLimiter, loginRules,             validate, authController.login);
router.post('/registro',           authLimiter, registroRules,          validate, authController.registro);
router.post('/recuperar-password', authLimiter, recuperarPasswordRules, validate, authController.recuperarPassword);
router.post('/nueva-password',     authLimiter, nuevaPasswordRules,     validate, authController.nuevaPassword);

module.exports = router;