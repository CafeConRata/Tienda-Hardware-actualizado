import { useEffect, useState } from "react";
import axios from "axios";
import CatalogoProductos from "../Global/CatalogoProductos";
import "../style/Catalogo.css";

function CatalogoPage() {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const res = await axios.get("http://localhost:3000/cargar/ObtenerProductos");
                setProductos(res.data);
            } catch (err) {
                console.error("Error al obtener productos:", err);
            }
        };
        fetchProductos();
    }, []);

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-4xl font-bold text-gray-900 text-center">Catálogo de Productos</h1>
                    <p className="text-gray-600 text-center mt-2">
                        Descubre nuestra selección premium de tecnología
                    </p>
                </div>
            </header>

            {/* Catálogo dinámico */}
            <CatalogoProductos productos={productos} />
        </main>
    );
}

export default CatalogoPage