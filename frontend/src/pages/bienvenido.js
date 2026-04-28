const sesion = getSession();
if (sesion?.nombre) {
    document.getElementById('nombre-txt').textContent = '¡Bienvenido, ' + sesion.nombre + '!';
}

setTimeout(() => {
    document.getElementById('wrap').classList.add('fadeout');
}, 3500);

setTimeout(() => {
    window.location.href = 'index.html';
}, 4500);