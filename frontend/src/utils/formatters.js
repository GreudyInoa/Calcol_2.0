function formatPrecio(num) {
    return '$' + Number(num).toLocaleString('es-CL');
}

function parsePrecio(str) {
    return parseInt(String(str).replace(/\D/g, '')) || 0;
}

function formatTelefono(tel) {
    if (!tel) return 'No registrado';
    return tel
        .replace('+569', '+56 9 ')
        .replace(/(\d{4})(\d{4})$/, '$1 $2');
}