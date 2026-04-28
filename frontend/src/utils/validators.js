const REGEX = {
    letras:       /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]$/,
    numeros:      /^[0-9]$/,
    letrasNums:   /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ0-9\s]$/,
    general:      /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ0-9\s.,]$/,
    email:        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

function bindInputFilter(input, regex, stripRegex) {
    input.addEventListener('keypress', e => {
        if (!regex.test(e.key)) e.preventDefault();
    });
    input.addEventListener('paste', e => {
        e.preventDefault();
        const texto = e.clipboardData.getData('text');
        input.value = texto.replace(stripRegex, '');
    });
    input.addEventListener('input', function () {
        this.value = this.value.replace(stripRegex, '');
    });
}

function soloLetras(input) {
    bindInputFilter(input, REGEX.letras, /[^a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]/g);
}

function soloNumeros(input, maxLen) {
    input.addEventListener('keypress', e => {
        if (!/[0-9]/.test(e.key)) e.preventDefault();
        if (maxLen && input.value.length >= maxLen) e.preventDefault();
    });
    input.addEventListener('paste', e => {
        e.preventDefault();
        const texto = e.clipboardData.getData('text');
        input.value = texto.replace(/[^0-9]/g, '').slice(0, maxLen);
    });
    input.addEventListener('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
        if (maxLen && this.value.length > maxLen) this.value = this.value.slice(0, maxLen);
    });
}

function letrasYNumeros(input) {
    bindInputFilter(input, REGEX.letrasNums, /[^a-záéíóúüñA-ZÁÉÍÓÚÜÑ0-9\s]/g);
}

function campoGeneral(input) {
    bindInputFilter(input, REGEX.general, /[^a-záéíóúüñA-ZÁÉÍÓÚÜÑ0-9\s.,]/g);
}

function toggleOjo(btn, input) {
    btn.textContent = '👁️';
    btn.addEventListener('click', () => {
        const esPass = input.type === 'password';
        input.type      = esPass ? 'text' : 'password';
        btn.textContent = esPass ? '🙈' : '👁️';
    });
}