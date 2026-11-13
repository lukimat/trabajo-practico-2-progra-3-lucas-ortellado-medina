//aca esta la logica que habla con la base de datos, y que se comunica con el front-end a traves de las rutas de api.js
const { Producto, Venta, VentaProducto } = require('../modelos/index.js');

// 1. Obtener todos los productos activos (para mostrarlos en el Tótem)
const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll({
            where: { activo: true }
        });
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
};

// 2. Registrar venta
const crearVenta = async (req, res) => {
    try {
        // viene del front end 
        const { nombreCliente, items } = req.body;

        if (!nombreCliente || !items || items.length === 0) {
            return res.status(400).json({ error: 'Faltan datos de la compra' });
        }
        let totalCalculado = 0;
        items.forEach(item => {
            totalCalculado += Number(item.precio) * Number(item.cantidad);
        });

        // 1° Guarda
        const nuevaVenta = await Venta.create({
            nombreCliente: nombreCliente,
            total: totalCalculado
        });
        for (const item of items) {
            await VentaProducto.create({
                ventaId: nuevaVenta.id,
                productoId: item.id,
                cantidad: item.cantidad,
                precioUnitario: item.precio
            });
        }
        res.status(201).json({
            mensaje: 'Venta registrada con éxito',
            ventaId: nuevaVenta.id,
            fecha: nuevaVenta.fecha,
            total: totalCalculado
        });
    } catch (error) {
        console.error('Error al registrar venta:', error);
        res.status(500).json({ error: 'Error interno al procesar la venta' });
    }
};

module.exports = {
    obtenerProductos,
    crearVenta
};