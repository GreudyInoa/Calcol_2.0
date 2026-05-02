'use strict';

process.env.JWT_SECRET  = 'clave_de_prueba_super_segura_minimo_32_chars_ok';
process.env.JWT_TTL     = '86400';
process.env.DB_NAME     = 'calcol_test';
process.env.DB_USER     = 'root';
process.env.DB_PASS     = '';
process.env.DB_HOST     = 'localhost';

const mockFindOne = jest.fn();

jest.mock('../../src/models', () => ({
  Usuario: {
    scope:    jest.fn().mockReturnThis(),
    findOne:  mockFindOne,
    findByPk: jest.fn(),
    create:   jest.fn(),
    update:   jest.fn(),
  },
  RecuperacionPassword: {
    destroy: jest.fn(),
    create:  jest.fn(),
    findOne: jest.fn(),
  },
}));

jest.mock('../../src/services/emailService', () => ({
  enviarRecuperacion: jest.fn().mockResolvedValue(undefined),
}));

const bcrypt      = require('bcryptjs');
const authService = require('../../src/services/authService');
const { Usuario, RecuperacionPassword } = require('../../src/models');

describe('AuthService — login', () => {
  beforeEach(() => jest.clearAllMocks());

  it('lanza error 401 si el usuario no existe', async () => {
    mockFindOne.mockResolvedValue(null);
    await expect(authService.login({ email: 'no@existe.cl', password: '12345678' }))
      .rejects.toMatchObject({ status: 401 });
  });

  it('lanza error 401 si la contraseña es incorrecta', async () => {
    const hash = await bcrypt.hash('correcta', 10);
    mockFindOne.mockResolvedValue({ id: 1, email: 'a@b.cl', password: hash, rol: 'cliente', nombre: 'Test', telefono: null });
    await expect(authService.login({ email: 'a@b.cl', password: 'incorrecta' }))
      .rejects.toMatchObject({ status: 401 });
  });

  it('retorna token y datos del usuario al hacer login correcto', async () => {
    const hash = await bcrypt.hash('password123', 10);
    const mockUsuario = { id: 1, email: 'test@test.cl', password: hash, rol: 'cliente', nombre: 'Test', telefono: null };
    mockFindOne.mockResolvedValue(mockUsuario);

    const result = await authService.login({ email: 'test@test.cl', password: 'password123' });

    expect(result).toHaveProperty('token');
    expect(result.usuario.email).toBe('test@test.cl');
    expect(result.usuario).not.toHaveProperty('password');
  });
});

describe('AuthService — registro', () => {
  beforeEach(() => jest.clearAllMocks());

  it('lanza error 409 si el email ya está registrado', async () => {
    Usuario.findOne.mockResolvedValue({ id: 1 });
    await expect(authService.registro({ nombre: 'Juan', email: 'a@b.cl', password: 'password123' }))
      .rejects.toMatchObject({ status: 409 });
  });

  it('crea usuario y retorna token', async () => {
    Usuario.findOne.mockResolvedValueOnce(null);
    Usuario.create.mockResolvedValue({ id: 2 });
    Usuario.findByPk.mockResolvedValue({ id: 2, nombre: 'Juan', email: 'juan@test.cl', telefono: null, rol: 'cliente' });

    const result = await authService.registro({ nombre: 'Juan', email: 'juan@test.cl', password: 'password123' });

    expect(result).toHaveProperty('token');
    expect(result.usuario.nombre).toBe('Juan');
  });
});

describe('AuthService — nuevaPassword', () => {
  beforeEach(() => jest.clearAllMocks());

  it('lanza error 400 si el token es inválido o expirado', async () => {
    RecuperacionPassword.findOne.mockResolvedValue(null);
    await expect(authService.nuevaPassword({ token: 'invalido', password: 'nueva1234' }))
      .rejects.toMatchObject({ status: 400 });
  });

  it('actualiza la contraseña con token válido', async () => {
    const mockRec = { usuario_id: 1, update: jest.fn().mockResolvedValue(true) };
    RecuperacionPassword.findOne.mockResolvedValue(mockRec);
    Usuario.update = jest.fn().mockResolvedValue([1]);

    await authService.nuevaPassword({ token: 'tokenvalido', password: 'nueva_password_123' });

    expect(mockRec.update).toHaveBeenCalledWith({ usado: true });
  });
});