'use strict';

const { Router } = require('express');

const router = Router();

router.use('/auth',      require('./auth.routes'));
router.use('/usuarios',  require('./usuario.routes'));
router.use('/productos', require('./producto.routes'));
router.use('/pedidos',   require('./pedido.routes'));

router.get('/health', (req, res) => {
  res.json({
    success:   true,
    status:    'ok',
    version:   '2.0.0',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;