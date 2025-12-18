
function ProductGrid({ onAddToCart }) {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const products = [
    {
      id: 1,
      name: "Procesador Intel Core i9",
      price: 599.99,
      category: "cpu",
      image: "🔧",
      rating: 4.8,
      reviews: 156,
      inStock: true,
    },
    {
      id: 2,
      name: "Tarjeta Gráfica RTX 4090",
      price: 1999.99,
      category: "gpu",
      image: "📊",
      rating: 4.9,
      reviews: 203,
      inStock: true,
    },
    {
      id: 3,
      name: "SSD NVMe 2TB",
      price: 249.99,
      category: "storage",
      image: "💾",
      rating: 4.7,
      reviews: 89,
      inStock: true,
    },
    {
      id: 4,
      name: "Memoria RAM 32GB DDR5",
      price: 159.99,
      category: "memory",
      image: "🧠",
      rating: 4.6,
      reviews: 124,
      inStock: true,
    },
    {
      id: 5,
      name: "Placa Base Z790",
      price: 329.99,
      category: "motherboard",
      image: "⚡",
      rating: 4.7,
      reviews: 92,
      inStock: true,
    },
    {
      id: 6,
      name: "Fuente de Poder 850W",
      price: 129.99,
      category: "power",
      image: "🔌",
      rating: 4.5,
      reviews: 67,
      inStock: true,
    },
    {
      id: 7,
      name: "Ventilador CPU AIO",
      price: 89.99,
      category: "cooling",
      image: "❄️",
      rating: 4.6,
      reviews: 145,
      inStock: true,
    },
    {
      id: 8,
      name: "Case Gaming RGB",
      price: 179.99,
      category: "case",
      image: "📦",
      rating: 4.4,
      reviews: 78,
      inStock: false,
    },
  ]

  const categories = [
    { value: "all", label: "Todos" },
    { value: "cpu", label: "Procesadores" },
    { value: "gpu", label: "Gráficas" },
    { value: "storage", label: "Almacenamiento" },
    { value: "memory", label: "Memoria" },
  ]

  const filteredProducts =
    selectedCategory === "all" ? products : products.filter((p) => p.category === selectedCategory)

  return (
    <section className="products" id="products">
      <div className="container">
        <div className="products-header">
          <h2>Nuestro Catálogo</h2>
          <p>Encuentra los mejores componentes para tu build</p>
        </div>

        <div className="category-filter">
          {categories.map((cat) => (
            <button
              key={cat.value}
              className={`filter-btn ${selectedCategory === cat.value ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductGrid
