const canvas = document.getElementById('brasas');
const ctx    = canvas.getContext('2d');

function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();

function crearParticula() {
    return {
        x:     Math.random() * canvas.width,
        y:     canvas.height + Math.random() * 20,
        r:     Math.random() * 3 + 1,
        vx:    (Math.random() - 0.5) * 0.3,
        vy:    -(Math.random() * 0.4 + 0.15),
        alpha: Math.random() * 0.8 + 0.2,
        color: `hsl(${Math.random() * 30 + 10}, 100%, ${Math.random() * 30 + 50}%)`,
    };
}

const particulas = Array.from({ length: 200 }, crearParticula);
particulas.forEach(p => { p.y = Math.random() * canvas.height; });

function animar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particulas.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.0004;
        if (p.alpha <= 0 || p.y < 0) particulas[i] = crearParticula();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle   = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(animar);
}
animar();

window.addEventListener('resize', () => {
    resize();
    particulas.forEach((_, i) => {
        particulas[i]   = crearParticula();
        particulas[i].y = Math.random() * canvas.height;
    });
});