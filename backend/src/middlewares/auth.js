'use strict';

const jwt      = require('jsonwebtoken');
const Response = require('../utils/response');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'] || '';

  if (!authHeader.startsWith('Bearer ')) {
    return Response.unauthorized(res, 'Token de autenticación requerido');
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return Response.unauthorized(res, 'Token de autenticación requerido');
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.authUser = {
      id:    payload.id,
      email: payload.email,
      rol:   payload.rol || 'cliente',
    };
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return Response.unauthorized(res, 'Token expirado');
    }
    return Response.unauthorized(res, 'Token inválido');
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.authUser) {
    return Response.unauthorized(res, 'No autenticado');
  }
  if (req.authUser.rol !== 'admin') {
    return Response.forbidden(res, 'Se requieren permisos de administrador');
  }
  return next();
};

module.exports = { authMiddleware, requireAdmin };