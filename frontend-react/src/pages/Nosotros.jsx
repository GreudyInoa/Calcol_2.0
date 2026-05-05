import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Nosotros.css'

export default function Nosotros() {
  return (
    <>
      <Navbar />
      <main className="nosotros-container">
        <h1>NOSOTROS</h1>
        <p className="mensaje-desarrollo">Esta sección está en desarrollo...</p>
      </main>
      <Footer />
    </>
  )
}