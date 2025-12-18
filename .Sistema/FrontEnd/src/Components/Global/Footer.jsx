
function Footer() {
  return (
  <>
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>TechStore</h4>
              <p>Tu tienda de confianza para componentes de hardware de calidad premium.</p>
            </div>

            <div className="footer-section">
              <h4>Categorías</h4>
              <ul>
                <li>
                  <a href="#products">Procesadores</a>
                </li>
                <li>
                  <a href="#products">Tarjetas Gráficas</a>
                </li>
                <li>
                  <a href="#products">Almacenamiento</a>
                </li>
                <li>
                  <a href="#products">Memoria RAM</a>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Empresa</h4>
              <ul>
                <li>
                  <a href="#about">Sobre nosotros</a>
                </li>
                <li>
                  <a href="#contact">Contacto</a>
                </li>
                <li>
                  <a href="#legal">Política de privacidad</a>
                </li>
                <li>
                  <a href="#legal">Términos de servicio</a>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Contáctanos</h4>
              <ul>
                <li>📧 info@TechStore.com</li>
                <li>📞 +54 11 3432-8432</li>
                <li>📍 Ministro Brin 2999, Lanús</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2025 TechStore. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
