const express = require('express');
const router = express.Router();
const upload = require('../Config/MulterConfig');

const {
    CargarProductos,
    ActualizarProducto,
    EliminarProducto,
    ObtenerProductos
} = require('../Controller/CargarProductos');

router.post('/CargarUnProducto', upload.single('imagen'), CargarProductos);

router.put('/productos/:id', upload.single('imagen'), ActualizarProducto);

router.delete('/productos/:id', EliminarProducto);

router.get('/ObtenerProductos', ObtenerProductos)

module.exports = router;