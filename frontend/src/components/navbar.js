document.addEventListener('DOMContentLoaded', () => {
    const btnNav = document.querySelector('.btn-nav-cta');
    if (!btnNav) return;

    const sesion = getSession();
    const enPages = window.location.pathname.includes('/pages/');
    const base    = enPages ? '../' : '';

    if (sesion?.nombre) {
        btnNav.innerHTML = `
            <img src="${base}assets/General/icono-perfil.png" alt="perfil" class="icono-nav" width="22" height="22"/>
            Hola, ${sesion.nombre}
        `;
        btnNav.href  = `${base}perfil.html`;
        btnNav.title = 'Ver mi perfil';
        btnNav.classList.add('logueado');
    } else {
        btnNav.innerHTML = 'Login';
        btnNav.href      = `${base}login.html`;
        btnNav.classList.remove('logueado');
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.href === window.location.href) {
            link.style.color = '#FFD700';
        }
    });
});