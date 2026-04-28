const botones  = document.querySelectorAll('.filtro-btn');
const tarjetas = document.querySelectorAll('.tarjeta-producto');

tarjetas.forEach(t => {
    if (t.dataset.categoria !== 'completos') t.style.display = 'none';
});

botones.forEach(btn => {
    btn.addEventListener('click', () => {
        botones.forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
        const filtro = btn.dataset.filtro;
        tarjetas.forEach(t => {
            t.style.display = t.dataset.categoria === filtro ? 'flex' : 'none';
        });
    });
});

const overlay         = document.getElementById('modal-producto-overlay');
const modalImg        = document.getElementById('modal-img');
const modalNombre     = document.getElementById('modal-nombre');
const modalDesc       = document.getElementById('modal-desc');
const modalPrecio     = document.getElementById('modal-precio');
const modalNota       = document.getElementById('modal-nota');
const modalCantidadEl = document.getElementById('modal-cantidad');
const modalCerrar     = document.getElementById('modal-cerrar');
const modalBtnAgregar = document.getElementById('modal-btn-agregar');
const modalMenos      = document.getElementById('modal-menos');
const modalMas        = document.getElementById('modal-mas');

let productoActual = null;
let cantidadActual = 1;

tarjetas.forEach(tarjeta => {
    tarjeta.addEventListener('click', () => {
        productoActual = {
            id:     tarjeta.dataset.id,
            nombre: tarjeta.dataset.nombre,
            precio: tarjeta.dataset.precio,
            desc:   tarjeta.dataset.desc,
            imagen: tarjeta.querySelector('.imagen-producto').src,
        };

        cantidadActual = 1;
        modalCantidadEl.textContent = 1;
        modalImg.src    = productoActual.imagen;
        modalImg.alt    = productoActual.nombre;
        modalNombre.textContent = productoActual.nombre;
        modalDesc.textContent   = productoActual.desc;
        modalPrecio.textContent = productoActual.precio;
        modalNota.value = '';

        overlay.classList.add('abierto');
    });
});

modalCerrar.addEventListener('click', () => overlay.classList.remove('abierto'));
overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('abierto');
});

modalMenos.addEventListener('click', () => {
    if (cantidadActual > 1) {
        cantidadActual--;
        modalCantidadEl.textContent = cantidadActual;
    }
});

modalMas.addEventListener('click', () => {
    cantidadActual++;
    modalCantidadEl.textContent = cantidadActual;
});

modalBtnAgregar.addEventListener('click', () => {
    if (!productoActual) return;

    carrito.push({
        id:       productoActual.id,
        nombre:   productoActual.nombre,
        precio:   productoActual.precio,
        imagen:   productoActual.imagen,
        cantidad: cantidadActual,
        nota:     modalNota.value,
    });

    overlay.classList.remove('abierto');
    actualizarCarrito();
    abrirCarrito();
});