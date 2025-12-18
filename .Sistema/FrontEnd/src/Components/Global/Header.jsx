import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import LogoTipo from '../../../../../Marketing/TechStore/TechStore Reducido/1x/Mesa de Trabajo 1@1x.png';
import Cart from "../Pages/Cart";

function Header({ cartCount }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  // 🔹 Obtener usuario desde localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/LoginForm");
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">

          {/* LOGO */}
          <div className="logo">
            <img src={LogoTipo} alt="" title="Logo" className="logo-icon" />
          </div>

          {/* NAVEGACIÓN */}
          <nav className={`nav ${isMenuOpen ? "active" : ""}`}>
            <Link to="/Inicio">Home</Link>
            <Link to="/CatalogoPage">Catálogo de Productos</Link>

            {/* 🔹 Solo admins ven estas rutas */}
            {user?.rol === 1 && (
              <>
                <Link to="/RegistrarProducto">Registrar Producto</Link>
                <Link to="/admin/productos">Panel de Administración</Link>
              </>
            )}

            {/* 🔹 Condicional login/register */}
            {user ? (
              <>
                <span className="user-greeting">Hola, {user.nombre} 👋</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/RegistrarUser">Register</Link>
                <Link to="/LoginForm">Iniciar Sesión</Link>
              </>
            )}
          </nav>

          {/* ACCIONES DEL HEADER */}
          <div className="header-actions">
            {/* BOTÓN DEL CARRITO */}
            <button
              className="cart-button"
              onClick={() => setIsCartOpen(!isCartOpen)}
            >
              <span className="cart-icon">🛒</span>
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </button>

            {/* BOTÓN HAMBURGUESA */}
            <button
              className="menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* MODAL DEL CARRITO */}
        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </header>
  );
}

export default Header;
