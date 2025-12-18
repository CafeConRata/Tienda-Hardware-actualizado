import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // 🔹 Importar SweetAlert2
import "../style/Formularios.css";

export default function RegistrarProducto() {
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
    });
    const [imagen, setImagen] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        setImagen(e.target.files[0]); // guardamos el archivo seleccionado
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = new FormData();
            data.append("Nombre", formData.nombre);
            data.append("Descripcion", formData.descripcion);
            data.append("Precio", formData.precio);
            data.append("Stock", formData.stock);
            data.append("imagen", imagen);

            const response = await axios.post(
                "http://localhost:3000/cargar/CargarUnProducto",
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            // 🔹 SweetAlert de éxito
            Swal.fire({
                icon: "success",
                title: "Producto registrado",
                text: "El producto se agregó correctamente ✅",
                confirmButtonColor: "#3b82f6",
            });

            console.log(response.data);
        } catch (error) {
            console.error("Error al guardar el producto:", error);

            // 🔹 SweetAlert de error
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un error al cargar el producto ❌",
                confirmButtonColor: "#ef4444",
            });
        }
    };
    
    return (
        <div className="form-container">
            <h2>Registrar Producto</h2>

            <form onSubmit={handleSubmit} className="form-box">
                <input name="nombre" onChange={handleChange} placeholder="Nombre" />
                <input name="descripcion" onChange={handleChange} placeholder="Descripción" />
                <input name="precio" onChange={handleChange} placeholder="Precio" type="number" />
                <input name="stock" onChange={handleChange} placeholder="Stock" type="number" />
                <label className="custom-file-upload">
                    <input type="file" name="imagen" accept="image/*" onChange={handleFileChange} />
                    Seleccionar imagen
                </label>

                <button type="submit">Registrar producto</button>
            </form>
        </div>
    );
}
