const express = require('express');
const router = express.Router();

const { 
        AgregarAlCarrito, 
        verCarrito,
        EliminarProducto,
        VaciarCarrito,
        CalcularTotal
    } = require('../Controller/CarritoController');
const verificarToken = require('../Middlewares/auth');

// agregar producto al carrito
router.post('/agregar', verificarToken, AgregarAlCarrito);
router.get('/ver', verificarToken, verCarrito);
router.delete('/eliminar/:id', verificarToken, EliminarProducto);
router.delete('/vaciar', verificarToken, VaciarCarrito);
router.get('/total', verificarToken, CalcularTotal);


module.exports = router;