import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/AdminProductosPage.css"; // 🔹 Importamos el CSS específico
import Swal from "sweetalert2";

function AdminProductosPage() {
    const [productos, setProductos] = useState([]);
    const navigate = useNavigate();

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

    const eliminarProducto = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/cargar/productos/${id}`);
            setProductos(productos.filter((p) => p.Id !== id));

            // 🔹 SweetAlert en lugar de alert()
            Swal.fire({
                icon: "success",
                title: "Producto eliminado",
                text: "El producto se eliminó correctamente ✅",
                confirmButtonColor: "#ef4444",
            });
        } catch (err) {
            console.error("Error al eliminar producto:", err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo eliminar el producto ❌",
                confirmButtonColor: "#ef4444",
            });
        }
    };
    // 🔹 Descargar Excel de compras
    const descargarExcel = () => {
        window.open("http://localhost:3000/api/compra/compras/excel", "_blank");
    };

    return (
        <main className="admin-container">
            <h2 className="admin-title">Administrar Productos</h2>
            {/* Botón para descargar Excel */}
            <button className="btn-excel" onClick={descargarExcel}>
                Descargar Excel de Compras Diarias 📊
            </button>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((p) => (
                        <tr key={p.Id}>
                            <td>
                                {p.Imagen && (
                                    <img
                                        src={`http://localhost:3000/Upload/productos/${p.Imagen}`}
                                        alt={p.Nombre}
                                        className="admin-img"
                                    />
                                )}
                            </td>
                            <td>{p.Nombre}</td>
                            <td>{p.Descripcion}</td>
                            <td>${p.Precio}</td>
                            <td>{p.Stock}</td>
                            <td>
                                <button
                                    className="btn-edit"
                                    onClick={() => navigate(`/editar/${p.Id}`)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="btn-delete"
                                    onClick={() => eliminarProducto(p.Id)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
}

export default AdminProductosPage
