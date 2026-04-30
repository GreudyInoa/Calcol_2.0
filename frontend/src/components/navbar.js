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

    const navbar   = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');

    const hamburger = document.createElement('button');
    hamburger.className = 'nav-hamburger';
    hamburger.setAttribute('aria-label', 'Menú');
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    navbar.insertBefore(hamburger, navLinks);

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('abierto');
        navLinks.classList.toggle('abierto');
    });

    navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            hamburger.classList.remove('abierto');
            navLinks.classList.remove('abierto');
        });
    });
});