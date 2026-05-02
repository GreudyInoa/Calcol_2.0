'use strict';

const Response = require('../../src/utils/response');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
};

describe('Response helper', () => {
  it('success responde 200 con success: true', () => {
    const res = mockRes();
    Response.success(res, { token: 'abc' }, 'OK');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, token: 'abc', mensaje: 'OK' }));
  });

  it('error responde con el código correcto', () => {
    const res = mockRes();
    Response.error(res, 'No encontrado', 404);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: 'No encontrado' });
  });

  it('unauthorized responde 401', () => {
    const res = mockRes();
    Response.unauthorized(res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('forbidden responde 403', () => {
    const res = mockRes();
    Response.forbidden(res, 'Acceso denegado');
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('validationError responde 422', () => {
    const res = mockRes();
    Response.validationError(res, 'Campo requerido');
    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Campo requerido' });
  });

  it('serverError responde 500', () => {
    const res = mockRes();
    Response.serverError(res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('conflict responde 409', () => {
    const res = mockRes();
    Response.conflict(res, 'Ya existe');
    expect(res.status).toHaveBeenCalledWith(409);
  });

  it('success acepta código personalizado', () => {
    const res = mockRes();
    Response.success(res, {}, 'Creado', 201);
    expect(res.status).toHaveBeenCalledWith(201);
  });
});