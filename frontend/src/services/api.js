const API_BASE = '/Calcol_2.0/backend/api';

async function apiFetch(endpoint, body = null, method = 'POST') {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
    };
    if (body) options.body = JSON.stringify(body);

    const res  = await fetch(API_BASE + endpoint, options);
    const data = await res.json();
    return data;
}

const api = {
    login:             (email, password)  => apiFetch('/login.php', { email, password }),
    registro:          (datos)            => apiFetch('/registro.php', datos),
    crearPedido:       (datos)            => apiFetch('/pedido.php', datos),
    recuperarPassword: (email)            => apiFetch('/recuperar_password.php', { email }),
    nuevaPassword:     (token, password)  => apiFetch('/nueva_password.php', { token, password }),
    editarPerfil:      (datos)            => apiFetch('/editar_perfil.php', datos),
    eliminarUsuario:   (email)            => apiFetch('/eliminar_usuario.php', { email }),
    productos:         (categoria = '')   => apiFetch('/producto.php' + (categoria ? `?categoria=${categoria}` : ''), null, 'GET'),
};