const tabBtns    = document.querySelectorAll('.tab-btn');
const panelLogin = document.getElementById('panel-login');
const panelReg   = document.getElementById('panel-registro');

const lEmail   = document.getElementById('l-email');
const lPass    = document.getElementById('l-pass');
const btnLogin = document.getElementById('btn-login');
const ojL      = document.getElementById('ojo-l');
const aLogin   = document.getElementById('alerta-login');
const aLoginT  = document.getElementById('alerta-login-txt');

const rNombre  = document.getElementById('r-nombre');
const rTel     = document.getElementById('r-tel');
const rEmail   = document.getElementById('r-email');
const rPass    = document.getElementById('r-pass');
const rPass2   = document.getElementById('r-pass2');
const btnReg   = document.getElementById('btn-registro');
const ojR      = document.getElementById('ojo-r');
const ojR2     = document.getElementById('ojo-r2');
const aReg     = document.getElementById('alerta-reg');
const aRegT    = document.getElementById('alerta-reg-txt');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
        if (btn.dataset.tab === 'login') {
            panelLogin.classList.add('activo');
            panelReg.classList.remove('activo');
        } else {
            panelReg.classList.add('activo');
            panelLogin.classList.remove('activo');
        }
        limpiarTodo();
    });
});

toggleOjo(ojL,  lPass);
toggleOjo(ojR,  rPass);
toggleOjo(ojR2, rPass2);

soloLetras(rNombre);
soloNumeros(rTel, 9);

[lEmail, lPass].forEach(inp => inp.addEventListener('input', () => {
    const ok = lEmail.value.trim() && lPass.value.trim();
    btnLogin.classList.toggle('listo', !!ok);
    inp.classList.remove('error');
    inp.closest('.form-group')?.querySelector('.err-txt')?.classList.remove('v');
}));

[rNombre, rTel, rEmail, rPass, rPass2].forEach(inp => inp.addEventListener('input', () => {
    const ok = rNombre.value.trim()
            && rTel.value.trim().length === 9
            && rEmail.value.trim()
            && rPass.value.trim()
            && rPass2.value.trim();
    btnReg.classList.toggle('listo', !!ok);
    inp.classList.remove('error');
    inp.closest('.form-group')?.querySelector('.err-txt')?.classList.remove('v');
}));

function marcarError(inputEl, errId) {
    inputEl.classList.add('error');
    document.getElementById(errId).classList.add('v');
}

function mostrarAlerta(alertaEl, txtEl, msg) {
    txtEl.textContent = msg;
    alertaEl.classList.add('v');
}

function limpiarTodo() {
    document.querySelectorAll('input').forEach(i => i.classList.remove('error'));
    document.querySelectorAll('.err-txt').forEach(e => e.classList.remove('v'));
    document.querySelectorAll('.alerta').forEach(a => a.classList.remove('v'));
}

function manejarExito(btn, nombre) {
    btn.textContent = '¡Bienvenido, ' + nombre + '!';
    btn.classList.add('exito');
    btn.classList.remove('listo');

    const redirect = localStorage.getItem('calcol_redirect');
    if (redirect === 'checkout') {
        localStorage.removeItem('calcol_redirect');
        setTimeout(() => { window.location.href = 'pages/checkout.html'; }, 1300);
    } else {
        setTimeout(() => { window.location.href = 'bienvenido.html'; }, 1300);
    }
}

async function handleLogin() {
    limpiarTodo();
    const email = lEmail.value.trim();
    const pass  = lPass.value.trim();
    let ok = true;

    if (!REGEX.email.test(email)) { marcarError(lEmail, 'l-email-err'); ok = false; }
    if (!pass)                    { marcarError(lPass,  'l-pass-err');  ok = false; }
    if (!ok) return;

    try {
        const data = await api.login(email, pass);
        if (data.error) {
            mostrarAlerta(aLogin, aLoginT, data.error);
            lEmail.classList.add('error');
            lPass.classList.add('error');
            return;
        }
        setSession(data);
        manejarExito(btnLogin, data.usuario.nombre);
    } catch {
        mostrarAlerta(aLogin, aLoginT, 'Error de conexión con el servidor.');
    }
}

async function handleRegistro() {
    limpiarTodo();
    const nombre = rNombre.value.trim();
    const tel    = rTel.value.trim();
    const email  = rEmail.value.trim();
    const pass   = rPass.value.trim();
    const pass2  = rPass2.value.trim();
    let ok = true;

    if (!nombre)                  { marcarError(rNombre, 'r-nombre-err'); ok = false; }
    if (tel.length !== 9)         { marcarError(rTel,    'r-tel-err');    ok = false; }
    if (!REGEX.email.test(email)) { marcarError(rEmail,  'r-email-err');  ok = false; }
    if (pass.length < 6)          { marcarError(rPass,   'r-pass-err');   ok = false; }
    if (pass !== pass2)           { marcarError(rPass2,  'r-pass2-err');  ok = false; }
    if (!ok) return;

    try {
        const data = await api.registro({ nombre, email, password: pass, telefono: '+56' + tel });
        if (data.error) {
            mostrarAlerta(aReg, aRegT, data.error);
            if (data.error.includes('correo')) rEmail.classList.add('error');
            return;
        }
        setSession(data);
        manejarExito(btnReg, data.usuario.nombre);

    } catch {
        mostrarAlerta(aReg, aRegT, 'Error de conexión con el servidor.');
    }
}

btnLogin.addEventListener('click', handleLogin);
lPass.addEventListener('keydown', e => { if (e.key === 'Enter') handleLogin(); });

btnReg.addEventListener('click', handleRegistro);
rPass2.addEventListener('keydown', e => { if (e.key === 'Enter') handleRegistro(); });