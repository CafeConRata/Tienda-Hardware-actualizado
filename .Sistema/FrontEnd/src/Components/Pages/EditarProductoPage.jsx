import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../style/EditarProductoPage.css"

function EditarProductoPage() {
    const { id } = useParams(); // 🔹 obtener el ID del producto desde la URL (/editar/:id)
    const navigate = useNavigate();

    // 🔹 Estado para el formulario
    const [formData, setFormData] = useState({
        Nombre: "",
        Descripcion: "",
        Precio: "",
        Stock: "",
        imagen: null,
    });

    // 🔹 Cargar datos del producto al entrar a la página
    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const res = await axios.get("http://localhost:3000/cargar/ObtenerProductos");
                const producto = res.data.find((p) => p.Id === parseInt(id));
                if (producto) {
                    setFormData({
                        Nombre: producto.Nombre,
                        Descripcion: producto.Descripcion,
                        Precio: producto.Precio,
                        Stock: producto.Stock,
                        imagen: null, // se mantiene null hasta que el usuario suba una nueva imagen
                    });
                }
            } catch (err) {
                console.error("Error al cargar producto:", err);
            }
        };
        fetchProducto();
    }, [id]);

    // 🔹 Guardar cambios
    const guardarEdicion = async () => {
        try {
            const data = new FormData();
            data.append("Nombre", formData.Nombre);
            data.append("Descripcion", formData.Descripcion);
            data.append("Precio", formData.Precio);
            data.append("Stock", formData.Stock);
            if (formData.imagen) data.append("imagen", formData.imagen);

            await axios.put(`http://localhost:3000/cargar/productos/${id}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // 🔹 SweetAlert en lugar de alert()
            Swal.fire({
                icon: "success",
                title: "Producto actualizado",
                text: "El producto se editó correctamente",
                confirmButtonColor: "#3b82f6",
            });

            navigate("/admin/productos");
        } catch (err) {
            console.error("Error al actualizar producto:", err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo actualizar el producto",
                confirmButtonColor: "#ef4444",
            });
        }
    };
    return (
        <main className="editar-container">
            <div className="form-card">
                <h2>Editar Producto</h2>
                <div className="flex flex-col gap-3">
                    <input
                        type="text"
                        value={formData.Nombre}
                        onChange={(e) => setFormData({ ...formData, Nombre: e.target.value })}
                        placeholder="Nombre"
                    />
                    <input
                        type="text"
                        value={formData.Descripcion}
                        onChange={(e) => setFormData({ ...formData, Descripcion: e.target.value })}
                        placeholder="Descripción"
                    />
                    <input
                        type="number"
                        value={formData.Precio}
                        onChange={(e) => setFormData({ ...formData, Precio: e.target.value })}
                        placeholder="Precio"
                    />
                    <input
                        type="number"
                        value={formData.Stock}
                        onChange={(e) => setFormData({ ...formData, Stock: e.target.value })}
                        placeholder="Stock"
                    />
                    <input
                        type="file"
                        onChange={(e) => setFormData({ ...formData, imagen: e.target.files[0] })}
                    />
                    <div className="flex gap-2 mt-4">
                        <button className="btn btn-guardar" onClick={guardarEdicion}>
                            Guardar
                        </button>
                        <button className="btn btn-cancelar" onClick={() => navigate("/admin/productos")}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default EditarProductoPage;
