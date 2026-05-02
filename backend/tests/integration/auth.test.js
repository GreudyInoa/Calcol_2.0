'use strict';

process.env.JWT_SECRET  = 'clave_de_prueba_super_segura_minimo_32_chars_ok';
process.env.JWT_TTL     = '86400';
process.env.DB_NAME     = 'calcol_test';
process.env.DB_USER     = 'root';
process.env.DB_PASS     = '';
process.env.DB_HOST     = 'localhost';
process.env.NODE_ENV    = 'test';
process.env.MAIL_USER   = 'test@test.cl';
process.env.MAIL_PASS   = 'testpass';

jest.mock('../../src/models', () => ({
  Usuario: {
    findOne:  jest.fn(),
    findByPk: jest.fn(),
    create:   jest.fn(),
    update:   jest.fn(),
    destroy:  jest.fn(),
    scope:    jest.fn().mockReturnThis(),
  },
  RecuperacionPassword: {
    findOne: jest.fn(),
    create:  jest.fn(),
    destroy: jest.fn(),
  },
  Pedido:        { scope: jest.fn().mockReturnThis(), count: jest.fn() },
  DetallePedido: {},
  Producto:      {},
  Categoria:     {},
  Inventario:    {},
  sequelize:     { transaction: jest.fn() },
}));

jest.mock('../../src/services/emailService', () => ({
  enviarRecuperacion: jest.fn().mockResolvedValue(undefined),
}));

const request = require('supertest');
const bcrypt  = require('bcryptjs');
const app     = require('../../src/app');
const { Usuario } = require('../../src/models');

describe('POST /api/v1/auth/login', () => {
  beforeEach(() => jest.clearAllMocks());

  it('retorna 422 si falta el email', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ password: '12345678' });
    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it('retorna 422 si el email no es válido', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email: 'no-es-email', password: '12345678' });
    expect(res.status).toBe(422);
  });

  it('retorna 401 si las credenciales son incorrectas', async () => {
    Usuario.findOne.mockResolvedValue(null);
    const res = await request(app).post('/api/v1/auth/login').send({ email: 'a@b.cl', password: '12345678' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('retorna 200 con token al hacer login correcto', async () => {
    const hash = await bcrypt.hash('password123', 10);
    Usuario.findOne.mockResolvedValue({ id: 1, email: 'a@b.cl', password: hash, rol: 'cliente', nombre: 'Juan', telefono: null });

    const res = await request(app).post('/api/v1/auth/login').send({ email: 'a@b.cl', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.usuario).not.toHaveProperty('password');
  });
});

describe('POST /api/v1/auth/registro', () => {
  beforeEach(() => jest.clearAllMocks());

  it('retorna 422 si la contraseña tiene menos de 8 caracteres', async () => {
    const res = await request(app).post('/api/v1/auth/registro').send({
      nombre: 'Juan', email: 'juan@test.cl', password: 'corta',
    });
    expect(res.status).toBe(422);
  });

  it('retorna 409 si el email ya existe', async () => {
    Usuario.findOne.mockResolvedValue({ id: 1 });
    const res = await request(app).post('/api/v1/auth/registro').send({
      nombre: 'Juan', email: 'juan@test.cl', password: 'password123',
    });
    expect(res.status).toBe(409);
  });

  it('retorna 201 al registrar correctamente', async () => {
    Usuario.findOne.mockResolvedValueOnce(null);
    Usuario.create.mockResolvedValue({ id: 2 });
    Usuario.findByPk.mockResolvedValue({ id: 2, nombre: 'Juan', email: 'juan@test.cl', telefono: null, rol: 'cliente' });

    const res = await request(app).post('/api/v1/auth/registro').send({
      nombre: 'Juan', email: 'juan@test.cl', password: 'password123',
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
  });
});

describe('GET /api/v1/health', () => {
  it('retorna 200 con status ok', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Ruta inexistente', () => {
  it('retorna 404', async () => {
    const res = await request(app).get('/api/v1/ruta-que-no-existe');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});