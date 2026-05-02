'use strict';

process.env.JWT_SECRET = 'clave_de_prueba_super_segura_minimo_32_chars_ok';
process.env.DB_NAME    = 'calcol_test';
process.env.DB_USER    = 'root';
process.env.DB_PASS    = '';
process.env.DB_HOST    = 'localhost';

jest.mock('../../src/models', () => ({
  Usuario: {
    findByPk: jest.fn(),
    destroy:  jest.fn(),
    update:   jest.fn(),
  },
  Pedido: {
    scope: jest.fn().mockReturnThis(),
    count: jest.fn(),
  },
  DetallePedido: {},
  Producto:      {},
  Categoria:     {},
}));

const usuarioService      = require('../../src/services/usuarioService');
const { Usuario, Pedido } = require('../../src/models');

describe('UsuarioService — editar', () => {
  beforeEach(() => jest.clearAllMocks());

  it('lanza 404 si el usuario no existe', async () => {
    Usuario.findByPk.mockResolvedValue(null);
    await expect(usuarioService.editar(99, { nombre: 'Test' }))
      .rejects.toMatchObject({ status: 404 });
  });

  it('actualiza el usuario correctamente', async () => {
    const mockUpdate = jest.fn().mockResolvedValue(true);
    Usuario.findByPk
      .mockResolvedValueOnce({ id: 1, update: mockUpdate })
      .mockResolvedValueOnce({ id: 1, nombre: 'Nuevo Nombre', email: 'a@b.cl', telefono: null, rol: 'cliente' });

    const result = await usuarioService.editar(1, { nombre: 'Nuevo Nombre' });

    expect(mockUpdate).toHaveBeenCalled();
    expect(result.nombre).toBe('Nuevo Nombre');
  });
});

describe('UsuarioService — eliminar', () => {
  beforeEach(() => jest.clearAllMocks());

  it('lanza error 400 si tiene pedidos activos', async () => {
    Pedido.scope.mockReturnValue({ count: jest.fn().mockResolvedValue(2) });
    await expect(usuarioService.eliminar(1))
      .rejects.toMatchObject({ status: 400 });
  });

  it('elimina el usuario si no tiene pedidos activos', async () => {
    Pedido.scope.mockReturnValue({ count: jest.fn().mockResolvedValue(0) });
    Usuario.destroy.mockResolvedValue(1);

    await expect(usuarioService.eliminar(1)).resolves.toBeUndefined();
    expect(Usuario.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});