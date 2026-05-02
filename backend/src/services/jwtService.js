'use strict';

const jwt = require('jsonwebtoken');

const issue = (payload) => {
  const ttl = parseInt(process.env.JWT_TTL || '86400', 10);
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: ttl });
};

const verify = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { issue, verify };