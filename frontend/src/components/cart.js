const ENVIO_GRATIS_MINIMO = 10000;

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

const panelCarrito      = document.getElementById('panel-carrito');
const carritoOverlay    = document.getElementById('carrito-overlay');
const btnCarritoFlotante = document.getElementById('btn-carrito-flotante');
const btnCarritoCerrar  = document.getElementById('carrito-cerrar');
const carritoItems      = document.getElementById('carrito-items');
const carritoTotal      = document.getElementById('carrito-total');
const carritoContador   = document.getElementById('carrito-contador');

const enPages = window.location.pathname.includes('/pages/');
const imgBase = enPages ? '../assets/' : 'assets/';

function abrirCarrito() {
    panelCarrito.classList.add('abierto');
    carritoOverlay.classList.add('abierto');
}

function cerrarCarrito() {
    panelCarrito.classList.remove('abierto');
    carritoOverlay.classList.remove('abierto');
}

btnCarritoFlotante.addEventListener('click', abrirCarrito);
btnCarritoCerrar.addEventListener('click', cerrarCarrito);
carritoOverlay.addEventListener('click', cerrarCarrito);

function actualizarCarrito() {
    if (carrito.length === 0) {
        carritoItems.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
        carritoTotal.textContent  = '$0';
        carritoContador.textContent = '0';
        localStorage.removeItem('carrito');
        actualizarEnvioGratis();
        return;
    }

    carritoItems.innerHTML = '';
    let total = 0;
    let contador = 0;

    carrito.forEach((producto, index) => {
        const precio = parsePrecio(producto.precio);
        total    += precio * producto.cantidad;
        contador += producto.cantidad;

        carritoItems.innerHTML += `
            <div class="carrito-item">
                <img class="carrito-item-imagen" src="${producto.imagen}" alt="${producto.nombre}">
                <div class="carrito-item-info">
                    <span class="carrito-item-nombre">${producto.nombre}</span>
                    ${producto.nota ? `<span class="carrito-item-nota">Sin: ${producto.nota}</span>` : ''}
                    <span class="carrito-item-precio">${producto.precio}</span>
                </div>
                <div class="carrito-item-controles">
                    <button class="carrito-item-eliminar" onclick="eliminarProducto(${index})">
                        <img src="${imgBase}Carrito/bote-de-basura.png" alt="Eliminar">
                    </button>
                    <div class="cantidad">
                        <button class="btn-cantidad" onclick="cambiarCantidad(${index}, -1)">-</button>
                        <span class="numero-cantidad">${producto.cantidad}</span>
                        <button class="btn-cantidad" onclick="cambiarCantidad(${index}, 1)">+</button>
                    </div>
                </div>
            </div>
        `;
    });

    carritoTotal.textContent    = formatPrecio(total);
    carritoContador.textContent = contador;
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarEnvioGratis();
}

function cambiarCantidad(index, delta) {
    carrito[index].cantidad += delta;
    if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
    actualizarCarrito();
}

function eliminarProducto(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
}

function actualizarEnvioGratis() {
    const subtotal  = carrito.reduce((sum, p) => sum + parsePrecio(p.precio) * p.cantidad, 0);
    const falta     = Math.max(0, ENVIO_GRATIS_MINIMO - subtotal);
    const progreso  = Math.min(100, (subtotal / ENVIO_GRATIS_MINIMO) * 100);

    const msg       = document.getElementById('envio-gratis-msg');
    const progresoEl = document.getElementById('envio-progreso');

    if (!msg || !progresoEl) return;

    msg.innerHTML = falta === 0
        ? '🎉 ¡Tienes <strong>envío gratis!</strong>'
        : `🚀 Te faltan <strong>${formatPrecio(falta)}</strong> para envío gratis`;

    progresoEl.style.width = progreso + '%';
}

actualizarCarrito();

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('carrito') === 'abierto') abrirCarrito();