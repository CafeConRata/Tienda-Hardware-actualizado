import Footer from './Global/Footer';
// import Hero from './Global/Hero';
import Header from './Global/Header';
import Register from './Pages/Register.jsx';
import Cart from './Pages/Cart.jsx';
import RegistrarProducto from './Pages/RegistrarProducto.jsx';
import './Layouts.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Pages/Home.jsx';
import LoginForm from './Pages/Login.jsx';
import CatalogoPage from './Pages/CatalagoPage.jsx';
import CarritoPage from './Pages/CarritoPage.jsx';
import EditarProductoPage from "./Pages/EditarProductoPage.jsx";
import AdminProductosPage from "./Pages/AdminProductosPage.jsx"; // 🔹 NUEVO

function Layouts() {
    return (
        <Router>
            <Header />
                <Routes>
                    <Route path="/Inicio" element={<Home />} />
                    <Route path="/RegistrarUser" element={<Register />} />
                    <Route path="/RegistrarProducto" element={<RegistrarProducto />} />
                    <Route path="/LoginForm" element={<LoginForm />} />
                    <Route path="/CatalogoPage" element={<CatalogoPage />} />
                    <Route path="/editar/:id" element={<EditarProductoPage />} />
                    <Route path="/admin/productos" element={<AdminProductosPage />} />
                    <Route path="/Carrito" element={<Cart />} />
                    <Route path="/CarritoPage" element={<CarritoPage />} />
                </Routes>
            <Footer />
        </Router>
);
}

export default Layouts;