import { useEffect, useState } from "react";
import axios from "axios";
import "../style/CarritoPage.css";

function CarritoPage() {
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);

    // Cargar carrito al entrar
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        axios.get("http://localhost:3000/api/carrito/ver", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                const mappedItems = res.data.carrito.map(p => ({
                    id: p.Id_carrito,
                    name: p.Nombre,
                    price: p.Precio,
                    quantity: p.Cantidad,
                    image: `http://localhost:3000/Upload/productos/${p.Imagen}`,
                }));
                setItems(mappedItems);
                const totalCalc = mappedItems.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                );
                setTotal(totalCalc);
            })
            .catch(err => console.error("Error al cargar carrito:", err));
    }, []);

    // Eliminar producto
    const eliminarProducto = (id) => {
        const token = localStorage.getItem("authToken");
        axios.delete(`http://localhost:3000/api/carrito/eliminar/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => {
                setItems(prev => prev.filter(i => i.id !== id));
                setTotal(prev => {
                    const item = items.find(i => i.id === id);
                    return item ? prev - (item.price * item.quantity) : prev;
                });
            })
            .catch(err => console.error("Error al eliminar producto:", err));
    };

    // Vaciar carrito
    const vaciarCarrito = () => {
        const token = localStorage.getItem("authToken");
        axios.delete("http://localhost:3000/api/carrito/vaciar", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => {
                setItems([]);
                setTotal(0);
            })
            .catch(err => console.error("Error al vaciar carrito:", err));
    };

    // Finalizar compra
    const finalizarCompra = () => {
        const token = localStorage.getItem("authToken");
        axios.post("http://localhost:3000/api/compra/finalizar", {}, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                alert("Compra realizada con éxito ✅");
                setItems([]);
                setTotal(0);
                // abrir el PDF de la factura en nueva pestaña
                window.open(`http://localhost:3000/api/compra/factura/${res.data.id}`, "_blank");
            })
            .catch(err => console.error("Error al finalizar compra:", err));
    };

    return (
        <div className="carrito-page">
            <h1>Carrito de Compras</h1>

            {items.length === 0 ? (
                <p>Tu carrito está vacío</p>
            ) : (
                <>
                    <div className="carrito-items">
                        {items.map(item => (
                            <div key={item.id} className="carrito-item">
                                <img src={item.image} alt={item.name} />
                                <div className="item-info">
                                    <h3>{item.name}</h3>
                                    <p>{item.quantity} x ${item.price.toFixed(2)}</p>
                                    <p>Total: ${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                                <button className="btn btn-danger" onClick={() => eliminarProducto(item.id)}>
                                    🗑️ Eliminar
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="carrito-summary">
                        <h2>Total general: ${total.toFixed(2)}</h2>
                    </div>

                    <div className="carrito-actions">
                        <button className="btn btn-outline" onClick={vaciarCarrito}>
                            Vaciar carrito
                        </button>
                        <button className="btn btn-primary" onClick={finalizarCompra}>
                            Finalizar compra
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default CarritoPage
