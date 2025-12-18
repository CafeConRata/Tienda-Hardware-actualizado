const express = require("express");
const router = express.Router();
const verificarToken = require("../Middlewares/auth"); 
const { finalizarCompra, obtenerFactura, obtenerExcelCompras } = require("../Controller/CompraController");

// Endpoint para finalizar la compra
router.post("/finalizar", finalizarCompra);

// Endpoint para obtener la factura PDF de una compra específica
router.get("/factura/:id", obtenerFactura);

// Endpoint para descargar el Excel de compras diarias
router.get("/compras/excel", obtenerExcelCompras);

module.exports = router;
