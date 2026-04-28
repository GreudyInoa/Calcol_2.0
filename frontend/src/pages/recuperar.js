const btnEnviar      = document.getElementById('btn-enviar');
const emailInput     = document.getElementById('email');
const alertaExito    = document.getElementById('alerta-exito');
const alertaError    = document.getElementById('alerta-error');
const alertaErrorTxt = document.getElementById('alerta-error-txt');

btnEnviar.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    alertaError.classList.remove('v');
    alertaExito.classList.remove('v');

    if (!email) {
        alertaErrorTxt.textContent = 'Por favor ingresa tu correo';
        alertaError.classList.add('v');
        return;
    }
    if (!REGEX.email.test(email)) {
        alertaErrorTxt.textContent = 'El correo no es válido';
        alertaError.classList.add('v');
        return;
    }

    btnEnviar.textContent = 'Enviando...';
    btnEnviar.disabled    = true;

    try {
        const data = await api.recuperarPassword(email);
        if (data.error) {
            alertaErrorTxt.textContent = data.error;
            alertaError.classList.add('v');
        } else {
            alertaExito.classList.add('v');
            document.querySelector('.form-group').style.display = 'none';
            btnEnviar.style.display = 'none';
            document.getElementById('btn-intentar-otro').style.display = 'block';
            emailInput.value = '';
            return;
        }
    } catch {
        alertaErrorTxt.textContent = 'Error de conexión con el servidor';
        alertaError.classList.add('v');
    }

    btnEnviar.textContent = 'Enviar link de recuperación';
    btnEnviar.disabled    = false;
});

document.getElementById('btn-intentar-otro').addEventListener('click', () => {
    alertaExito.classList.remove('v');
    document.querySelector('.form-group').style.display = 'block';
    btnEnviar.style.display    = 'block';
    btnEnviar.textContent      = 'Enviar link de recuperación';
    btnEnviar.disabled         = false;
    document.getElementById('btn-intentar-otro').style.display = 'none';
    emailInput.value = '';
    emailInput.focus();
});

emailInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') btnEnviar.click();
});