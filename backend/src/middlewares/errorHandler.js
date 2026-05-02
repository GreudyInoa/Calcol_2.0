'use strict';

const { ValidationError, UniqueConstraintError, ForeignKeyConstraintError } = require('sequelize');

const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ERROR ${req.method} ${req.path}:`, err.message);

  if (err.name === 'ValidationError' || err instanceof ValidationError) {
    const messages = err.errors ? err.errors.map((e) => e.message).join(', ') : err.message;
    return res.status(422).json({ success: false, error: messages });
  }

  if (err instanceof UniqueConstraintError) {
    const field = err.errors[0]?.path || 'campo';
    return res.status(409).json({ success: false, error: `El ${field} ya está registrado` });
  }

  if (err instanceof ForeignKeyConstraintError) {
    return res.status(400).json({ success: false, error: 'Referencia a un recurso que no existe' });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, error: 'Token inválido' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, error: 'Token expirado' });
  }

  if (err.status && err.status < 500) {
    return res.status(err.status).json({ success: false, error: err.message });
  }

  return res.status(500).json({ success: false, error: 'Error interno del servidor' });
};

const notFound = (req, res) => {
  return res.status(404).json({ success: false, error: `Ruta no encontrada: ${req.method} ${req.path}` });
};

module.exports = { errorHandler, notFound };