import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Promociones from './pages/Promociones'
import Login from './pages/Login'
import Perfil from './pages/Perfil'
import Checkout from './pages/Checkout'
import Entrega from './pages/Entrega'
import Pago from './pages/Pago'
import Bienvenido from './pages/Bienvenido'
import Confirmacion from './pages/Confirmacion'
import Recuperar from './pages/Recuperar'
import NuevaPassword from './pages/NuevaPassword'
import Nosotros from './pages/Nosotros'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/promociones" element={<Promociones />} />
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/entrega" element={<Entrega />} />
        <Route path="/pago" element={<Pago />} />
        <Route path="/bienvenido" element={<Bienvenido />} />
        <Route path="/confirmacion" element={<Confirmacion />} />
        <Route path="/recuperar" element={<Recuperar />} />
        <Route path="/nueva-password" element={<NuevaPassword />} />
        <Route path="/nosotros" element={<Nosotros />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App