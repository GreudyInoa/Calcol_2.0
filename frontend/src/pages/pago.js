const carrito  = JSON.parse(localStorage.getItem('carrito')) || [];
const checkout = JSON.parse(sessionStorage.getItem('calcol_checkout')) || {};

const COSTO_ENVIO = 2000;

if (!checkout.direccion) window.location.href = 'entrega.html';

document.getElementById('entrega-direccion').textContent = checkout.direccion || '';
const instrEl = document.getElementById('entrega-instrucciones');
if (checkout.instrucciones) {
    instrEl.textContent   = checkout.instrucciones;
    instrEl.style.display = 'block';
} else {
    instrEl.style.display = 'none';
}

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

const tarjetas = [];
let tarjetaEditandoIndex = null;

const pagoOpciones       = document.getElementById('pago-opciones');
const btnAgregarTarjeta  = document.getElementById('btn-agregar-tarjeta');
const modalOverlay       = document.getElementById('modal-overlay');
const modalTarjeta       = document.getElementById('modal-tarjeta');
const btnCerrarModal     = document.getElementById('btn-cerrar-modal');
const btnCancelarTarjeta = document.getElementById('btn-cancelar-tarjeta');
const btnGuardarTarjeta  = document.getElementById('btn-guardar-tarjeta');

function renderTarjetas() {
    document.querySelectorAll('.pago-opcion-tarjeta').forEach(el => el.remove());

    const enPages = window.location.pathname.includes('/pages/');
    const imgBase = enPages ? '../assets/' : 'assets/';

    tarjetas.forEach((tarjeta, index) => {
        const opcion = document.createElement('div');
        opcion.className = 'pago-opcion pago-opcion-tarjeta';
        opcion.innerHTML = `
            <input type="radio" name="pago" value="tarjeta-${index}">
            <img class="pago-opcion-icono" src="${tarjeta.logoSrc}" alt="${tarjeta.tipo}">
            <div class="pago-opcion-texto">
                <strong>${tarjeta.tipo} ••••${tarjeta.ultimos4}</strong>
                <span>Débito o crédito</span>
            </div>
            <button class="btn-editar-tarjeta-opcion" data-index="${index}" title="Editar">✏️</button>
            <button class="btn-eliminar-tarjeta-opcion" data-index="${index}" title="Eliminar">
                <img src="${imgBase}Carrito/bote-de-basura.png" alt="Eliminar">
            </button>
        `;
        pagoOpciones.appendChild(opcion);
    });

    document.querySelectorAll('.btn-editar-tarjeta-opcion').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            const index = parseInt(btn.dataset.index);
            tarjetaEditandoIndex = index;
            cargarTarjetaEnModal(tarjetas[index]);
            abrirModal('Editar tarjeta');
        });
    });

    document.querySelectorAll('.btn-eliminar-tarjeta-opcion').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            tarjetas.splice(parseInt(btn.dataset.index), 1);
            renderTarjetas();
            document.querySelector('input[name="pago"][value="efectivo"]').checked = true;
        });
    });
}

const tarjetaNumeroInput   = document.getElementById('tarjeta-numero');
const tarjetaNombreInput   = document.getElementById('tarjeta-nombre');
const tarjetaFechaInput    = document.getElementById('tarjeta-fecha');
const tarjetaCvvInput      = document.getElementById('tarjeta-cvv');
const tarjetaLogo          = document.getElementById('tarjeta-logo');
const tarjetaNumeroPreview = document.getElementById('tarjeta-numero-preview');
const tarjetaNombrePreview = document.getElementById('tarjeta-nombre-preview');
const tarjetaFechaPreview  = document.getElementById('tarjeta-fecha-preview');

const enPages = window.location.pathname.includes('/pages/');
const imgBase = enPages ? '../assets/' : 'assets/';

function cargarTarjetaEnModal(tarjeta) {
    tarjetaNumeroInput.value = tarjeta.numero;
    tarjetaNombreInput.value = tarjeta.nombre;
    tarjetaFechaInput.value  = tarjeta.fecha;
    tarjetaCvvInput.value    = '';
    tarjetaNumeroPreview.textContent = tarjeta.numero || '**** **** **** ****';
    tarjetaNombrePreview.textContent = tarjeta.nombre.toUpperCase() || 'NOMBRE EN LA TARJETA';
    tarjetaFechaPreview.textContent  = tarjeta.fecha || 'MM/AA';
    tarjetaLogo.src = tarjeta.logoSrc;
}

function abrirModal(titulo = 'Agregar tarjeta') {
    document.getElementById('modal-titulo-tarjeta').textContent = titulo;
    modalOverlay.classList.add('abierto');
    modalTarjeta.classList.add('abierto');
}

function cerrarModal() {
    modalOverlay.classList.remove('abierto');
    modalTarjeta.classList.remove('abierto');
    limpiarFormTarjeta();
    tarjetaEditandoIndex = null;
}

function limpiarFormTarjeta() {
    tarjetaNumeroInput.value = '';
    tarjetaNombreInput.value = '';
    tarjetaFechaInput.value  = '';
    tarjetaCvvInput.value    = '';
    tarjetaNumeroPreview.textContent = '**** **** **** ****';
    tarjetaNombrePreview.textContent = 'NOMBRE EN LA TARJETA';
    tarjetaFechaPreview.textContent  = 'MM/AA';
    tarjetaLogo.src = imgBase + 'Carrito/icono-visa.png';
}

btnAgregarTarjeta.addEventListener('click', () => { tarjetaEditandoIndex = null; abrirModal('Agregar tarjeta'); });
btnCerrarModal.addEventListener('click', cerrarModal);
btnCancelarTarjeta.addEventListener('click', cerrarModal);
modalOverlay.addEventListener('click', cerrarModal);

tarjetaNumeroInput.addEventListener('input', function () {
    let valor = this.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
    this.value = valor;
    const primer = valor.charAt(0);
    tarjetaLogo.src = primer === '5'
        ? imgBase + 'Carrito/icono-mastercard.png'
        : imgBase + 'Carrito/icono-visa.png';
    tarjetaNumeroPreview.textContent = valor || '**** **** **** ****';
});

tarjetaNombreInput.addEventListener('input', function () {
    this.value = this.value.replace(/[^a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]/g, '');
    tarjetaNombrePreview.textContent = this.value.toUpperCase() || 'NOMBRE EN LA TARJETA';
});

tarjetaFechaInput.addEventListener('keydown', function (e) {
    if (e.key === 'Backspace') {
        e.preventDefault();
        this.value = this.value.slice(0, -1).replace(/\/$/, '');
        tarjetaFechaPreview.textContent = this.value || 'MM/AA';
    }
});

tarjetaFechaInput.addEventListener('input', function () {
    let valor = this.value.replace(/\D/g, '');
    if (valor.length >= 2) valor = valor.substring(0, 2) + '/' + valor.substring(2);
    this.value = valor;
    tarjetaFechaPreview.textContent = valor || 'MM/AA';
});

tarjetaCvvInput.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '');
});

btnGuardarTarjeta.addEventListener('click', () => {
    const numero = tarjetaNumeroInput.value;
    const nombre = tarjetaNombreInput.value;
    const fecha  = tarjetaFechaInput.value;
    const cvv    = tarjetaCvvInput.value;

    if (!numero || !nombre || !fecha) {
        alert('Por favor completa número, nombre y fecha de la tarjeta');
        return;
    }
    if (tarjetaEditandoIndex === null && !cvv) {
        alert('Por favor ingresa el CVV');
        return;
    }

    const ultimos4 = numero.replace(/\D/g, '').slice(-4);
    const primer   = numero.replace(/\D/g, '').charAt(0);
    const tipo     = primer === '4' ? 'Visa' : primer === '5' ? 'Mastercard' : 'Tarjeta';
    const logoSrc  = primer === '5'
        ? imgBase + 'Carrito/icono-mastercard.png'
        : imgBase + 'Carrito/icono-visa.png';

    const datosTarjeta = { numero, nombre, fecha, ultimos4, tipo, logoSrc };

    if (tarjetaEditandoIndex !== null) {
        tarjetas[tarjetaEditandoIndex] = datosTarjeta;
    } else {
        tarjetas.push(datosTarjeta);
    }

    renderTarjetas();

    const radioIdx = tarjetaEditandoIndex !== null ? tarjetaEditandoIndex : tarjetas.length - 1;
    const radio = document.querySelector(`input[name="pago"][value="tarjeta-${radioIdx}"]`);
    if (radio) radio.checked = true;

    cerrarModal();
});

const modalDireccionOverlay = document.getElementById('modal-direccion-overlay');
const modalDireccion        = document.getElementById('modal-direccion');

soloNumeros(document.getElementById('edit-numero'));
soloLetras(document.getElementById('edit-calle'));

document.getElementById('btn-editar-direccion').addEventListener('click', () => {
    const partes       = (checkout.direccion || '').split(',').map(p => p.trim());
    const ultimaParte  = partes[partes.length - 1];
    const comunas      = ['Pudahuel', 'Cerro Navia', 'Lo Prado', 'Maipú', 'Renca', 'Quinta Normal', 'Estación Central'];
    const comuna       = comunas.includes(ultimaParte) ? ultimaParte : '';
    const calleNumero  = partes[0] || '';
    const depto        = partes.length === 3 ? partes[1] : '';

    document.getElementById('edit-calle').value         = calleNumero.split(' ').slice(0, -1).join(' ');
    document.getElementById('edit-numero').value        = calleNumero.split(' ').pop();
    document.getElementById('edit-depto').value         = depto;
    document.getElementById('edit-comuna').value        = comuna;
    document.getElementById('edit-instrucciones').value = checkout.instrucciones || '';

    modalDireccionOverlay.classList.add('abierto');
    modalDireccion.classList.add('abierto');
});

function cerrarModalDireccion() {
    modalDireccionOverlay.classList.remove('abierto');
    modalDireccion.classList.remove('abierto');
}

document.getElementById('btn-cerrar-direccion').addEventListener('click', cerrarModalDireccion);
document.getElementById('btn-cancelar-direccion').addEventListener('click', cerrarModalDireccion);
modalDireccionOverlay.addEventListener('click', cerrarModalDireccion);

document.getElementById('btn-guardar-direccion').addEventListener('click', () => {
    const comuna        = document.getElementById('edit-comuna').value.trim();
    const calle         = document.getElementById('edit-calle').value.trim();
    const numero        = document.getElementById('edit-numero').value.trim();
    const depto         = document.getElementById('edit-depto').value.trim();
    const instrucciones = document.getElementById('edit-instrucciones').value.trim();

    if (!comuna || !calle || !numero) {
        alert('Por favor completa comuna, calle y número');
        return;
    }

    const direccionCompleta = `${calle} ${numero}${depto ? ', ' + depto : ''}, ${comuna}`;
    checkout.direccion     = direccionCompleta;
    checkout.instrucciones = instrucciones;
    sessionStorage.setItem('calcol_checkout', JSON.stringify(checkout));

    document.getElementById('entrega-direccion').textContent = direccionCompleta;
    const el = document.getElementById('entrega-instrucciones');
    if (instrucciones) {
        el.textContent   = instrucciones;
        el.style.display = 'block';
    } else {
        el.style.display = 'none';
    }

    cerrarModalDireccion();
});

document.getElementById('btn-confirmar').addEventListener('click', async () => {
    const sesion = getSession();
    if (!sesion) {
        alert('Debes iniciar sesión para continuar');
        window.location.href = '../login.html';
        return;
    }

    const metodoPago = document.querySelector('input[name="pago"]:checked')?.value?.startsWith('tarjeta')
        ? 'tarjeta' : 'efectivo';

    let subtotal = 0;
    const items = carrito.map(p => {
        const precio = parsePrecio(p.precio);
        subtotal += precio * p.cantidad;
        return { producto_id: p.id || null, cantidad: p.cantidad, precio, nota: p.nota || '' };
    });

    const btn = document.getElementById('btn-confirmar');
    btn.textContent = 'Procesando...';
    btn.disabled    = true;

    try {
        const data = await api.crearPedido({
            usuario_id:    sesion.id,
            direccion:     checkout.direccion,
            instrucciones: checkout.instrucciones || '',
            subtotal,
            envio:         COSTO_ENVIO,
            total:         subtotal + COSTO_ENVIO,
            cubiertos:     checkout.cubiertos || 0,
            salsa:         checkout.salsa || 0,
            metodo_pago:   metodoPago,
            items,
        });

        if (data.error) {
            alert('Error: ' + data.error);
            btn.textContent = '🔥 Confirmar pedido';
            btn.disabled    = false;
            return;
        }

        localStorage.removeItem('carrito');
        sessionStorage.removeItem('calcol_checkout');
        window.location.href = '../confirmacion.html';

    } catch {
        alert('Error de conexión con el servidor.');
        btn.textContent = '🔥 Confirmar pedido';
        btn.disabled    = false;
    }
});