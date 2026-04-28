const sesion = requireSession('login.html');

document.getElementById('perfil-nombre').textContent = sesion.nombre;
document.getElementById('dato-nombre').textContent   = sesion.nombre;
document.getElementById('dato-email').textContent    = sesion.email;
document.getElementById('dato-tel').textContent      = formatTelefono(sesion.telefono);

const badgeRol = document.getElementById('perfil-rol');
if (sesion.rol === 'admin') {
    badgeRol.textContent    = 'Administrador';
    badgeRol.style.display  = 'inline-block';
} else if (sesion.rol === 'empleado') {
    badgeRol.textContent    = 'Empleado';
    badgeRol.style.display  = 'inline-block';
} else {
    badgeRol.style.display = 'none';
}

const datoRol = document.getElementById('dato-rol');
const itemRol = document.getElementById('item-rol');
if (sesion.rol === 'cliente') {
    if (itemRol) itemRol.style.display = 'none';
} else {
    datoRol.textContent = sesion.rol === 'admin' ? 'Administrador' : 'Empleado';
}

const iniciales = sesion.nombre
    .split(' ')
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
document.getElementById('avatar-iniciales').textContent = iniciales;

const modalEditarOverlay = document.getElementById('modal-editar-overlay');

document.getElementById('btn-editar-perfil').addEventListener('click', () => {
    const telLimpio = (sesion.telefono || '').replace(/\D/g, '').slice(-9);
    document.getElementById('edit-nombre').value = sesion.nombre;
    document.getElementById('edit-tel').value    = telLimpio;
    limpiarErroresEditar();
    modalEditarOverlay.classList.add('visible');
});

document.getElementById('btn-cancelar-editar').addEventListener('click', () =>
    modalEditarOverlay.classList.remove('visible'));

modalEditarOverlay.addEventListener('click', e => {
    if (e.target === modalEditarOverlay) modalEditarOverlay.classList.remove('visible');
});

function limpiarErroresEditar() {
    ['err-nombre', 'err-tel'].forEach(id => {
        document.getElementById(id).textContent = '';
    });
}

document.getElementById('btn-guardar-editar').addEventListener('click', async () => {
    limpiarErroresEditar();
    const nombre = document.getElementById('edit-nombre').value.trim();
    const tel    = document.getElementById('edit-tel').value.trim();
    let valido   = true;

    if (!nombre) {
        document.getElementById('err-nombre').textContent = 'El nombre es obligatorio';
        valido = false;
    }
    if (tel && tel.length !== 9) {
        document.getElementById('err-tel').textContent = 'El teléfono debe tener 9 dígitos';
        valido = false;
    }
    if (!valido) return;

    const btnGuardar = document.getElementById('btn-guardar-editar');
    btnGuardar.textContent = 'Guardando...';
    btnGuardar.disabled    = true;

    const telefono = tel ? '+56 9' + tel : sesion.telefono;

    try {
        const data = await api.editarPerfil({ email: sesion.email, nombre, telefono });

        if (data.error) {
            alert(data.error);
            btnGuardar.textContent = 'Guardar cambios';
            btnGuardar.disabled    = false;
            return;
        }

        sesion.nombre   = nombre;
        sesion.telefono = telefono;
        setSession(sesion);

        document.getElementById('perfil-nombre').textContent = nombre;
        document.getElementById('dato-nombre').textContent   = nombre;
        document.getElementById('dato-tel').textContent      = formatTelefono(telefono);

        const nuevasIniciales = nombre.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
        document.getElementById('avatar-iniciales').textContent = nuevasIniciales;

        modalEditarOverlay.classList.remove('visible');
        btnGuardar.textContent = 'Guardar cambios';
        btnGuardar.disabled    = false;

    } catch {
        alert('Error de conexión con el servidor.');
        btnGuardar.textContent = 'Guardar cambios';
        btnGuardar.disabled    = false;
    }
});

const modalCerrarOverlay = document.getElementById('modal-cerrar-overlay');

document.getElementById('btn-cerrar').addEventListener('click', () =>
    modalCerrarOverlay.classList.add('visible'));

document.getElementById('btn-cancelar-cerrar').addEventListener('click', () =>
    modalCerrarOverlay.classList.remove('visible'));

document.getElementById('btn-confirmar-cerrar').addEventListener('click', () => {
    clearSession();
    window.location.href = 'index.html';
});

modalCerrarOverlay.addEventListener('click', e => {
    if (e.target === modalCerrarOverlay) modalCerrarOverlay.classList.remove('visible');
});

const modalOverlay = document.getElementById('modal-overlay');

document.getElementById('btn-eliminar').addEventListener('click', () =>
    modalOverlay.classList.add('visible'));

document.getElementById('btn-cancelar').addEventListener('click', () =>
    modalOverlay.classList.remove('visible'));

modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) modalOverlay.classList.remove('visible');
});