const filtros = document.querySelectorAll('.promo-filtro-btn');
const cards   = document.querySelectorAll('.promo-card');
let cantidad  = 1;
let promoIdActual = null;

filtros.forEach(btn => {
    btn.addEventListener('click', () => {
        filtros.forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
        const filtro = btn.dataset.filtro;
        cards.forEach(card => {
            if (filtro === 'todos' || card.dataset.categoria === filtro) {
                card.classList.add('visible');
            } else {
                card.classList.remove('visible');
            }
        });
    });
});

const promoModalOverlay = document.getElementById('promo-modal-overlay');
const promoModal        = document.getElementById('promo-modal');

function cerrarPromoModal() {
    promoModalOverlay.classList.remove('abierto');
    promoModal.classList.remove('abierto');
}

promoModalOverlay.addEventListener('click', cerrarPromoModal);
document.getElementById('promo-modal-cerrar').addEventListener('click', cerrarPromoModal);

cards.forEach(card => {
    card.addEventListener('click', () => {
        promoIdActual = card.dataset.id;
        document.getElementById('promo-modal-imagen').src  = card.querySelector('.promo-card-imagen').src;
        document.getElementById('promo-modal-nombre').textContent = card.querySelector('.promo-card-nombre').textContent;
        document.getElementById('promo-modal-desc').textContent   = card.querySelector('.promo-card-desc').textContent;
        document.getElementById('promo-modal-antes').textContent  = card.querySelector('.promo-precio-antes').textContent;
        document.getElementById('promo-modal-ahora').textContent  = card.querySelector('.promo-precio-ahora').textContent;
        document.getElementById('promo-modal-badge').textContent  = card.querySelector('.promo-badge').textContent;

        cantidad = 1;
        document.getElementById('promo-modal-cantidad').textContent  = '1';
        document.getElementById('promo-modal-agregar').style.display = 'block';
        document.getElementById('promo-modal-seguir').style.display  = 'none';

        promoModalOverlay.classList.add('abierto');
        promoModal.classList.add('abierto');
    });
});

document.querySelector('.promo-modal-menos').addEventListener('click', () => {
    if (cantidad > 1) {
        cantidad--;
        document.getElementById('promo-modal-cantidad').textContent = cantidad;
    }
});

document.querySelector('.promo-modal-mas').addEventListener('click', () => {
    cantidad++;
    document.getElementById('promo-modal-cantidad').textContent = cantidad;
});

document.getElementById('promo-modal-agregar').addEventListener('click', () => {
    const nombre   = document.getElementById('promo-modal-nombre').textContent;
    const precio   = document.getElementById('promo-modal-ahora').textContent;
    const imagen   = document.getElementById('promo-modal-imagen').src;
    const existente = carrito.find(p => p.nombre === nombre);

    if (existente) {
        existente.cantidad += cantidad;
    } else {
        carrito.push({ id: promoIdActual, nombre, precio, imagen, cantidad, nota: '' });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
    cerrarPromoModal();
    abrirCarrito();
});

document.getElementById('promo-modal-seguir').addEventListener('click', cerrarPromoModal);