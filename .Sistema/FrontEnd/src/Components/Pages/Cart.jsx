import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ← para redirigir a CarritoPage
import axios from "axios";
import "../style/Cart.css";

function Cart({ isOpen, onClose }) {
  const [items, setItems] = useState([]);
  const navigate = useNavigate(); // ← hook de react-router para navegar

  // Cargar carrito desde backend cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      console.log("Modal abierto, voy a pedir el carrito");
      const token = localStorage.getItem("authToken");
      axios
        .get("http://localhost:3000/api/carrito/ver", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log("RESPUESTA DEL BACKEND:", res.data);
          const mappedItems = res.data.carrito.map((p) => ({
            id: p.Id_carrito, // usar el id del carrito
            name: p.Nombre,
            price: p.Precio,
            quantity: p.Cantidad,
            image: `http://localhost:3000/Upload/productos/${p.Imagen}`,
          }));
          setItems(mappedItems);
          console.log("ITEMS MAPEADOS:", mappedItems);
        })
        .catch((err) => console.error("Error al cargar carrito:", err));
    }
  }, [isOpen]);

  // Calcular total general en el frontend (reduce)
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-modal slide-in" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Carrito de Compras</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <p>Tu carrito está vacío</p>
            <button className="btn btn-primary" onClick={onClose}>
              Continuar comprando
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: "60px", height: "60px", objectFit: "cover" }}
                    />
                  </div>
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p className="item-price">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="item-quantity">
                    {/* Aquí podrías agregar botones +/- para cambiar cantidad */}
                  </div>
                  <div className="item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  {/* BOTÓN ELIMINAR PRODUCTO */}
                  <button
                    className="remove-btn"
                    onClick={() => {
                      const token = localStorage.getItem("authToken");
                      axios.delete(`http://localhost:3000/api/carrito/eliminar/${item.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                      })
                      .then(() => {
                        // Actualizar estado eliminando el producto
                        setItems(prev => prev.filter((i) => i.id !== item.id));
                      })
                      .catch(err => console.error("Error al eliminar:", err));
                    }}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            {/* RESUMEN DEL CARRITO */}
            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Envío:</span>
                <span>Gratis</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* ACCIONES DEL CARRITO */}
            <div className="cart-actions">

              {/* BOTÓN VACIAR CARRITO */}
              <button
                className="btn btn-outline"
                onClick={() => {
                  const token = localStorage.getItem("authToken");
                  axios.delete("http://localhost:3000/api/carrito/vaciar", {
                    headers: { Authorization: `Bearer ${token}` },
                  })
                  .then(() => setItems([])) // vaciar estado
                  .catch(err => console.error("Error al vaciar carrito:", err));
                }}
              >
                Vaciar carrito
              </button>

              {/* BOTÓN CONTINUAR COMPRA → CarritoPage.jsx */}
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/CarritoPage")}
              >
                Continuar compra
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;
