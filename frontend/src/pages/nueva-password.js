const token         = new URLSearchParams(window.location.search).get('token');
const formNuevaPass = document.getElementById('form-nueva-pass');
const tokenInvalido = document.getElementById('token-invalido');
const cambioExitoso = document.getElementById('cambio-exitoso');
const alertaError   = document.getElementById('alerta-error');
const alertaErrorTxt = document.getElementById('alerta-error-txt');

toggleOjo(document.getElementById('ojo-nueva'),     document.getElementById('nueva-pass'));
toggleOjo(document.getElementById('ojo-confirmar'), document.getElementById('confirmar-pass'));

if (!token) {
    formNuevaPass.style.display = 'none';
    tokenInvalido.style.display = 'block';
}

document.getElementById('btn-cambiar')?.addEventListener('click', async () => {
    const nuevaPass     = document.getElementById('nueva-pass').value;
    const confirmarPass = document.getElementById('confirmar-pass').value;
    alertaError.classList.remove('v');

    if (nuevaPass.length < 6) {
        alertaErrorTxt.textContent = 'La contraseña debe tener al menos 6 caracteres';
        alertaError.classList.add('v');
        return;
    }
    if (nuevaPass !== confirmarPass) {
        alertaErrorTxt.textContent = 'Las contraseñas no coinciden';
        alertaError.classList.add('v');
        return;
    }

    const btn = document.getElementById('btn-cambiar');
    btn.textContent = 'Cambiando...';
    btn.disabled    = true;

    try {
        const data = await api.nuevaPassword(token, nuevaPass);
        if (data.error) {
            if (data.error.includes('inválido') || data.error.includes('expirado')) {
                formNuevaPass.style.display = 'none';
                tokenInvalido.style.display = 'block';
            } else {
                alertaErrorTxt.textContent = data.error;
                alertaError.classList.add('v');
                btn.textContent = 'Cambiar contraseña';
                btn.disabled    = false;
            }
        } else {
            formNuevaPass.style.display = 'none';
            cambioExitoso.style.display = 'block';
        }
    } catch {
        alertaErrorTxt.textContent = 'Error de conexión con el servidor';
        alertaError.classList.add('v');
        btn.textContent = 'Cambiar contraseña';
        btn.disabled    = false;
    }
});