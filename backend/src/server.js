'use strict';

require('dotenv').config();

const app           = require('./app');
const { sequelize } = require('./models');

const PORT = parseInt(process.env.PORT || '3000', 10);

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('[DB] Conexión establecida correctamente.');

    app.listen(PORT, () => {
      console.log(`[SERVER] Calcol API v2.0 corriendo en http://localhost:${PORT}/api/v1`);
      console.log(`[SERVER] Health check: http://localhost:${PORT}/api/v1/health`);
      console.log(`[ENV] Entorno: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error('[ERROR] No se pudo iniciar el servidor:', err.message);
    process.exit(1);
  }
};

start();