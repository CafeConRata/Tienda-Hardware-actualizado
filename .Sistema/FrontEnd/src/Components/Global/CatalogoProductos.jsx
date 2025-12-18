import axios from "axios";
import Swal from "sweetalert2"; // 🔹 Importar SweetAlert2
export default function CatalogoProductos({ productos }) {
    const agregarAlCarrito = async (producto) => {
        try {
            const token = localStorage.getItem("authToken");
            await axios.post(
                "http://localhost:3000/api/carrito/agregar",
                {
                    Id_producto: producto.Id,
                    Cantidad: 1,
                    Nombre: producto.Nombre,
                    Total: producto.Precio * 1
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            // 🔹 SweetAlert de éxito
            Swal.fire({
                icon: "success",
                title: "Producto agregado",
                text: `${producto.Nombre} se agregó al carrito ✅`,
                confirmButtonColor: "#3b82f6",
            });
        } catch (error) {
            console.error("Error al agregar al carrito:", error);

            // 🔹 SweetAlert de error
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo agregar al carrito ❌",
                confirmButtonColor: "#ef4444",
            });
        }
    };
    return (
        <div className="catalogo-container">
            <div className="catalogo-grid">
                {productos.map((producto, index) => (
                    <div key={index} className="catalogo-card">
                                                {/* Contenedor fijo para la imagen */}
                        <div className="catalogo-card-img">
                            <img src={`http://localhost:3000/Upload/productos/${producto.Imagen}`} alt={producto.Nombre} />
                        </div>
                        <div className="catalogo-card-body">
                            <h3 className="catalogo-card-title">{producto.Nombre}</h3>
                            <p className="catalogo-card-desc">{producto.Descripcion}</p>
                            <div className="catalogo-card-info">
                                <span className="catalogo-card-price">${producto.Precio}</span>
                                <span className="catalogo-card-stock">Stock: {producto.Stock}</span>
                            </div>
                            <button
                                disabled={producto.Stock === 0}
                                onClick={() => agregarAlCarrito(producto)}
                            >
                                {producto.Stock === 0 ? "Sin stock" : "Agregar al carrito"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

    