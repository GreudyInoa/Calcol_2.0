'use strict';

require('dotenv').config();

const express            = require('express');
const cors               = require('cors');
const { generalLimiter } = require('./middlewares/rateLimiter');
const { errorHandler, notFound } = require('./middlewares/errorHandler');
const routes             = require('./routes');

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost')
  .split(',')
  .map((o) => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const isAllowed =
      allowedOrigins.includes(origin) ||
      origin.startsWith('http://localhost') ||
      origin.startsWith('http://127.0.0.1');
    if (isAllowed) return callback(null, true);
    return callback(new Error(`CORS: origen no permitido — ${origin}`));
  },
  methods:             ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders:      ['Content-Type', 'Authorization'],
  credentials:         true,
  optionsSuccessStatus: 204,
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use(generalLimiter);

app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;