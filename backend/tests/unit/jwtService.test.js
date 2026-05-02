'use strict';

process.env.JWT_SECRET = 'clave_de_prueba_super_segura_minimo_32_chars_ok';
process.env.JWT_TTL    = '86400';
process.env.DB_NAME    = 'calcol_test';
process.env.DB_USER    = 'root';
process.env.DB_PASS    = '';
process.env.DB_HOST    = 'localhost';

const jwtService = require('../../src/services/jwtService');
const jwt        = require('jsonwebtoken');

describe('JwtService', () => {
  it('issue genera un token válido', () => {
    const token = jwtService.issue({ id: 1, email: 'a@b.cl', rol: 'cliente' });
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);
  });

  it('verify decodifica el payload correctamente', () => {
    const payload = { id: 5, email: 'test@test.cl', rol: 'admin' };
    const token   = jwtService.issue(payload);
    const decoded = jwtService.verify(token);
    expect(decoded.id).toBe(5);
    expect(decoded.email).toBe('test@test.cl');
    expect(decoded.rol).toBe('admin');
  });

  it('verify lanza error con token inválido', () => {
    expect(() => jwtService.verify('token.invalido.totalmente')).toThrow();
  });

  it('verify lanza TokenExpiredError con token expirado', () => {
    const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET, { expiresIn: -1 });
    expect(() => jwtService.verify(token)).toThrow('jwt expired');
  });
});