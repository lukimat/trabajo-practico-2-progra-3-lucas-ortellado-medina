// rutas/api.js
const express = require('express');
const router = express.Router();
const apiController = require('../controladores/apiController.js');

// GET http://localhost:3000/api/productos -> Devuelve el JSON de productos activos
router.get('/productos', apiController.obtenerProductos);

// POST http://localhost:3000/api/ventas -> Recibe el carrito y guarda la compra en MySQL
router.post('/ventas', apiController.crearVenta);

module.exports = router;