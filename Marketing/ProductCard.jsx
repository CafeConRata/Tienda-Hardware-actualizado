
function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card card">
      <div className="product-image">
        <span className="image-emoji">{product.image}</span>
        {!product.inStock && <div className="out-of-stock">Sin Stock</div>}
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>

        <div className="rating">
          <span className="stars">{"⭐".repeat(Math.floor(product.rating))}</span>
          <span className="rating-text">({product.reviews})</span>
        </div>

        <div className="price">
          <span className="currency">$</span>
          <span className="amount">{product.price.toFixed(2)}</span>
        </div>

        <button
          className={`btn ${product.inStock ? "btn-secondary" : "btn-disabled"}`}
          onClick={() => onAddToCart(product)}
          disabled={!product.inStock}
        >
          {product.inStock ? "Agregar al carrito" : "No disponible"}
        </button>
      </div>
    </div>
  )
}

export default ProductCard
