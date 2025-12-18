import "../style/Home.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

function Hero() {
    return (
        <section className="hero">
            <h1>TechStore — Tu tienda de hardware de confianza</h1>
            <p>
                Descubre los mejores componentes de hardware al mejor precio.
                Calidad garantizada y envío rápido.
            </p>
            <Link to="/CatalogoPage">
                <button>Ver Productos</button>
            </Link>
        </section>
    );
}

function FeaturedProducts() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const res = await axios.get("http://localhost:3000/cargar/ObtenerProductos");
                // 🔹 Ordenar por ID (últimos agregados al final)
                const sorted = res.data.sort((a, b) => a.Id - b.Id);
                // 🔹 Tomar los últimos 4
                const ultimos4 = sorted.slice(-4);
                setProducts(ultimos4);
            } catch (err) {
                console.error("Error al cargar productos destacados:", err);
            }
        };
        fetchProductos();
    }, []);

    // 🔹 Función para añadir al carrito
    const agregarAlCarrito = async (producto) => {
        try {
            const token = localStorage.getItem("authToken");
            await axios.post(
                "http://localhost:3000/api/carrito/agregar",
                {
                    Id_producto: producto.Id,
                    Cantidad: 1,
                    Nombre: producto.Nombre,
                    Total: producto.Precio * 1,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            Swal.fire({
                icon: "success",
                title: "Producto agregado",
                text: `${producto.Nombre} se agregó al carrito ✅`,
                confirmButtonColor: "#3b82f6",
            });
        } catch (error) {
            console.error("Error al agregar al carrito:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo agregar al carrito ❌",
                confirmButtonColor: "#ef4444",
            });
        }
    };

    return (
        <section className="featured-section">
            <h2>Productos Destacados</h2>
            <div className="featured-grid">
                {products.map((product) => (
                    <div key={product.Id} className="product-card">
                        <img
                            src={`http://localhost:3000/Upload/productos/${product.Imagen}`}
                            alt={product.Nombre}
                        />
                        <h3>{product.Nombre}</h3>
                        <p>${product.Precio}</p>
                        <button
                            disabled={product.Stock === 0}
                            onClick={() => agregarAlCarrito(product)}
                        >
                            {product.Stock === 0 ? "Sin stock" : "Agregar al carrito"}
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}

function PromoBanner() {
    return (
        <section className="promo-banner">
            <h2>Ofertas de Verano</h2>
            <p>¡Hasta 30% OFF en componentes seleccionados!</p>
            <Link to="/CatalogoPage">
                <button>Comprar Ahora</button>
            </Link>
        </section>
    );
}

function TrustSection() {
    const trustItems = [
        { id: 1, title: "Envíos a todo el país", icon: "🚚" },
        { id: 2, title: "Garantía oficial", icon: "✅" },
        { id: 3, title: "Atención 24/7", icon: "💬" },
    ];

    return (
        <section className="trust-section">
            {trustItems.map((item) => (
                <div key={item.id} className="trust-item">
                    <div className="icon">{item.icon}</div>
                    <h3>{item.title}</h3>
                    <p>Nos comprometemos a brindarte la mejor experiencia de compra.</p>
                </div>
            ))}
        </section>
    );
}

export default function Home() {
    return (
        <div className="home-container">
            <Hero />
            <FeaturedProducts />
            <PromoBanner />
            <TrustSection />
        </div>
    );
}