'use strict';

const Response = {
  success(res, data = {}, message = '', statusCode = 200) {
    const payload = { success: true };
    if (message) payload.mensaje = message;
    return res.status(statusCode).json({ ...payload, ...data });
  },

  error(res, message, statusCode = 400) {
    return res.status(statusCode).json({ success: false, error: message });
  },

  validationError(res, message) {
    return res.status(422).json({ success: false, error: message });
  },

  unauthorized(res, message = 'No autorizado') {
    return res.status(401).json({ success: false, error: message });
  },

  forbidden(res, message = 'Acceso denegado') {
    return res.status(403).json({ success: false, error: message });
  },

  notFound(res, message = 'Recurso no encontrado') {
    return res.status(404).json({ success: false, error: message });
  },

  conflict(res, message) {
    return res.status(409).json({ success: false, error: message });
  },

  serverError(res) {
    return res.status(500).json({ success: false, error: 'Error interno del servidor' });
  },
};

module.exports = Response;