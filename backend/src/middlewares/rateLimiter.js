'use strict';

const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs:               15 * 60 * 1000,
  max:                    20,
  standardHeaders:        true,
  legacyHeaders:          false,
  message:                { success: false, error: 'Demasiados intentos. Espera 15 minutos antes de volver a intentarlo.' },
  skipSuccessfulRequests: true,
});

const generalLimiter = rateLimit({
  windowMs:        60 * 1000,
  max:             100,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         { success: false, error: 'Demasiadas solicitudes. Intenta de nuevo en un minuto.' },
});

module.exports = { authLimiter, generalLimiter };