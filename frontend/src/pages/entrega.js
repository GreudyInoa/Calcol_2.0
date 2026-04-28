const carrito  = JSON.parse(localStorage.getItem('carrito')) || [];
const checkout = JSON.parse(sessionStorage.getItem('calcol_checkout')) || {};

const COSTO_ENVIO = 2000;

if (carrito.length === 0) window.location.href = 'checkout.html';

function renderResumen() {
    const resumenItems = document.getElementById('resumen-items');
    const resumenBadge = document.getElementById('resumen-badge');
    const subtotalEl   = document.getElementById('checkout-subtotal');
    const totalEl      = document.getElementById('checkout-total');

    let subtotal  = 0;
    let articulos = 0;
    resumenItems.innerHTML = '';

    carrito.forEach(producto => {
        const precio = parsePrecio(producto.precio);
        subtotal  += precio * producto.cantidad;
        articulos += producto.cantidad;

        resumenItems.innerHTML += `
            <div class="carrito-item">
                <img class="carrito-item-img" src="${producto.imagen}" alt="${producto.nombre}">
                <div class="carrito-item-info">
                    <span class="carrito-item-nombre">${producto.nombre}</span>
                    <span class="carrito-item-precio">${producto.precio}</span>
                </div>
                <span class="resumen-badge">${producto.cantidad}</span>
            </div>
        `;
    });

    resumenBadge.textContent = `${articulos} artículo${articulos !== 1 ? 's' : ''}`;
    subtotalEl.textContent   = formatPrecio(subtotal);
    totalEl.textContent      = formatPrecio(subtotal + COSTO_ENVIO);
}

renderResumen();

document.getElementById('btn-continuar').addEventListener('click', () => {
    const comuna       = document.getElementById('comuna').value.trim();
    const direccion    = document.getElementById('direccion').value.trim();
    const numero       = document.getElementById('numero').value.trim();
    const depto        = document.getElementById('depto').value.trim();
    const instrucciones = document.getElementById('instrucciones').value.trim();

    const errComuna    = document.getElementById('err-comuna');
    const errDireccion = document.getElementById('err-direccion');
    const errNumero    = document.getElementById('err-numero');

    errComuna.classList.remove('visible');
    errDireccion.classList.remove('visible');
    errNumero.classList.remove('visible');

    let valido = true;
    if (!comuna)    { errComuna.classList.add('visible');    valido = false; }
    if (!direccion) { errDireccion.classList.add('visible'); valido = false; }
    if (!numero)    { errNumero.classList.add('visible');    valido = false; }
    if (!valido) return;

    const direccionCompleta = `${direccion} ${numero}${depto ? ', ' + depto : ''}, ${comuna}`;
    checkout.direccion     = direccionCompleta;
    checkout.instrucciones = instrucciones;
    sessionStorage.setItem('calcol_checkout', JSON.stringify(checkout));
    window.location.href = 'pago.html';
});

document.getElementById('comuna').addEventListener('change', () =>
    document.getElementById('err-comuna').classList.remove('visible'));
document.getElementById('direccion').addEventListener('input', () =>
    document.getElementById('err-direccion').classList.remove('visible'));
document.getElementById('numero').addEventListener('input', () =>
    document.getElementById('err-numero').classList.remove('visible'));

soloLetras(document.getElementById('direccion'));
soloNumeros(document.getElementById('numero'));
letrasYNumeros(document.getElementById('depto'));
campoGeneral(document.getElementById('instrucciones'));