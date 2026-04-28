const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

const carritoItems    = document.getElementById('carrito-items');
const carritoBadge    = document.getElementById('carrito-badge');
const checkoutSubtotal = document.getElementById('checkout-subtotal');
const checkoutTotal   = document.getElementById('checkout-total');
const btnContinuar    = document.getElementById('btn-continuar');

const COSTO_ENVIO = 2000;

function renderCarrito() {
    if (carrito.length === 0) {
        carritoItems.innerHTML      = '<p class="carrito-vacio">Tu carrito está vacío</p>';
        carritoBadge.textContent    = '0 artículos';
        checkoutSubtotal.textContent = '$0';
        checkoutTotal.textContent   = formatPrecio(COSTO_ENVIO);
        return;
    }

    let subtotal = 0;
    let articulos = 0;
    carritoItems.innerHTML = '';

    carrito.forEach((producto, index) => {
        const precio = parsePrecio(producto.precio);
        subtotal  += precio * producto.cantidad;
        articulos += producto.cantidad;

        carritoItems.innerHTML += `
            <div class="carrito-item">
                <img class="carrito-item-img" src="${producto.imagen}" alt="${producto.nombre}">
                <div class="carrito-item-info">
                    <span class="carrito-item-nombre">${producto.nombre}</span>
                    <span class="carrito-item-precio">${producto.precio}</span>
                    ${producto.nota ? `<span class="carrito-item-nota">Sin: ${producto.nota}</span>` : ''}
                </div>
                <div class="carrito-item-controles">
                    <button class="btn-cantidad" onclick="cambiarCantidad(${index}, -1)">−</button>
                    <span class="carrito-item-cantidad">${producto.cantidad}</span>
                    <button class="btn-cantidad" onclick="cambiarCantidad(${index}, 1)">+</button>
                    <button class="btn-eliminar-item" onclick="eliminarItem(${index})">🗑</button>
                </div>
            </div>
        `;
    });

    carritoBadge.textContent     = `${articulos} artículo${articulos !== 1 ? 's' : ''}`;
    checkoutSubtotal.textContent = formatPrecio(subtotal);
    checkoutTotal.textContent    = formatPrecio(subtotal + COSTO_ENVIO);
}

function cambiarCantidad(index, delta) {
    carrito[index].cantidad += delta;
    if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderCarrito();
}

function eliminarItem(index) {
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderCarrito();
}

btnContinuar.addEventListener('click', () => {
    const sesion = getSession();

    if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    const cubiertos = document.getElementById('pedir-cubiertos').checked ? 1 : 0;
    const salsa     = document.getElementById('pedir-salsa').checked ? 1 : 0;

    if (!sesion) {
        localStorage.setItem('calcol_checkout', JSON.stringify({ cubiertos, salsa }));
        localStorage.setItem('calcol_redirect', 'checkout');
        window.location.href = '../login.html';
        return;
    }

    sessionStorage.setItem('calcol_checkout', JSON.stringify({ cubiertos, salsa }));
    window.location.href = 'entrega.html';
});

renderCarrito();