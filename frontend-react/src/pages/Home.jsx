import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Home.css'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <section className="hero" id="inicio">
          <div className="hero-bg" />
          <div className="hero-overlay" />
          <div className="hero-tex">
            <p className="hero-sub">🔥 EL SABOR DEL BARRIO</p>
            <h1 className="hero-titulo">
              CALCOL — <span className="resaltar">EL<br />VERDADERO<br />SABOR</span><br />DOMINICANO
            </h1>
            <p className="hero-parrafo">
              Siente la esencia de la calle en cada mordida. Ingredientes frescos, sazón criollo y el toque que solo nosotros sabemos dar.
            </p>
          </div>
          <div className="hero-imagen">
            <div className="hero-hamburguesa">
              <img src="/assets/Index/Hamburguesa-refresco.png" alt="Hamburguesa Calcol" />
            </div>
          </div>
          <div className="hero-btns">
            <Link className="btn-primary" to="/menu">
              Ver menú
              <img src="/assets/Index/icono-tenedor.png" alt="Ver menu" />
            </Link>
            <Link className="btn-secondary" to="/menu">
              Ordenar ya
              <img src="/assets/Index/icono-bolsa.png" alt="Ordenar ya" />
            </Link>
          </div>
        </section>

        <section className="stats">
          <div className="stat"><span className="stat-numero">5+</span><span className="stat-label">Años de sabor</span></div>
          <div className="stat"><span className="stat-numero">3k+</span><span className="stat-label">Clientes felices</span></div>
          <div className="stat"><span className="stat-numero">20+</span><span className="stat-label">Recetas únicas</span></div>
        </section>

        <section className="contact" id="contacto">
          <div className="contact-info">
            <h2 className="contact-titulo">¿TIENES <span className="hambre-rojo">HAMBRE?</span></h2>
            <div className="info-item">
              <img className="info-icon" src="/assets/Index/icono-ubi.png" alt="Ubicación" />
              <div className="info-text">
                <strong>Ubicación</strong>
                <span>San Pablo 8648, 9020670 Pudahuel, Región Metropolitana</span>
              </div>
            </div>
            <div className="info-item">
              <img className="info-icon" src="/assets/Index/icono-cel.png" alt="Teléfono" />
              <div className="info-text">
                <strong>Teléfono</strong>
                <span>+56 9 9597 5511</span>
              </div>
            </div>
            <div className="info-item">
              <img className="info-icon" src="/assets/Index/icono-reloj.png" alt="Horario" />
              <div className="info-text">
                <strong>Horario</strong>
                <span>Lun – Vie: 9:00 AM – 8:00 PM<br />Sáb: 9:00 AM – 5:00 PM</span>
              </div>
            </div>
            <div className="redes">
              <a className="redes-btn" href="#" aria-label="WhatsApp"><img src="/assets/Index/icono-whasap.png" alt="WhatsApp" /></a>
              <a className="redes-btn" href="#" aria-label="Instagram"><img src="/assets/Index/icono-IG.png" alt="Instagram" /></a>
              <a className="redes-btn" href="#" aria-label="Facebook"><img src="/assets/Index/icono-FB.png" alt="Facebook" /></a>
              <a className="redes-btn" href="#" aria-label="TikTok"><img src="/assets/Index/icono-tiktok.png" alt="TikTok" /></a>
            </div>
          </div>
          <div className="mapa">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.1823128202877!2d-70.7520553!3d-33.444556399999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c3b9ddcb071f%3A0x6291623c6492e0d2!2sSan%20Pablo%208648%2C%209020670%20Pudahuel%2C%20Regi%C3%B3n%20Metropolitana!5e0!3m2!1ses!2scl!4v1775666564030!5m2!1ses!2scl"
              title="Mapa Calcol"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}