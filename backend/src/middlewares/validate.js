'use strict';

const { validationResult } = require('express-validator');
const Response             = require('../utils/response');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    return Response.validationError(res, firstError.msg);
  }
  return next();
};

module.exports = validate;