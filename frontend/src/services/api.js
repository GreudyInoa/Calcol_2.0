const API_BASE = '/Calcol_2.0/backend/public/api';

async function apiFetch(endpoint, body = null, method = 'POST') {
    const token = getToken();
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
    };
    if (token) {
        options.headers['Authorization'] = 'Bearer ' + token;
    }
    if (body) options.body = JSON.stringify(body);

    const res  = await fetch(API_BASE + endpoint, options);
    const data = await res.json();
    return data;
}

const api = {
    login:             (email, password) => apiFetch('/auth/login', { email, password }),
    registro:          (datos)           => apiFetch('/auth/registro', datos),
    crearPedido:       (datos)           => apiFetch('/pedidos', datos),
    recuperarPassword: (email)           => apiFetch('/auth/recuperar-password', { email }),
    nuevaPassword:     (token, password) => apiFetch('/auth/nueva-password', { token, password }),
    editarPerfil:      (datos)           => apiFetch('/usuarios/me', datos, 'PUT'),
    eliminarUsuario:   ()                => apiFetch('/usuarios/me', null, 'DELETE'),
    productos:         (categoria = '')  => apiFetch('/productos' + (categoria ? `?categoria=${categoria}` : ''), null, 'GET'),
};