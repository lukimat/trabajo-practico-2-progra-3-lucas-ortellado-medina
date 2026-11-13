const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const { sequelize, Producto, Usuario } = require('./modelos/index.js');
const apiRoutes = require('./rutas/api.js');
const adminRoutes = require('./rutas/admin.js');

const app = express();
const PUERTO = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'vistas'));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser()); 
app.use(express.static(path.join(__dirname, 'contenido_estatico')));

app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);

app.get('/estado', (req, res) => {
    res.json({ mensaje: 'Servidor funcionando correctamente' });
});

app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
});

try {
    const baseDeDatos = require("./modelos/db.js");

    baseDeDatos.authenticate()
    .then(() => {
        console.log('Conexión a la base de datos establecida correctamente.');
    });

    baseDeDatos.sync()
    .then(async () => {
        console.log('Modelos sincronizados con la base de datos.');

        const cantUsuarios = await Usuario.count();
        if (cantUsuarios === 0) {
            const hash = await bcrypt.hash('123456', 10);
            await Usuario.create({ correo: 'admin@totem.com', password: hash });
            console.log('Usuario admin@totem.com creado.');
        }
        const cantProductos = await Producto.count();
        if (cantProductos === 0) {
            await Producto.bulkCreate([
                { nombre: 'Procesador Ryzen 5 5500X3D', precio: 245000, categoria: 'componentes', imagen: 'default.png', activo: true },
                { nombre: 'Placa de Video Radeon RX 6700 XT', precio: 480000, categoria: 'componentes', imagen: 'default.png', activo: true },
                { nombre: 'SSD M.2 NVMe 1TB ADATA', precio: 85000, categoria: 'componentes', imagen: 'default.png', activo: true },
                { nombre: 'Monitor Curvo 24" 144Hz', precio: 260000, categoria: 'perifericos', imagen: 'default.png', activo: true },
                { nombre: 'Auriculares In-Ear Monitor', precio: 35000, categoria: 'perifericos', imagen: 'default.png', activo: true },
                { nombre: 'Teclado Mecánico RGB Compacto', precio: 62000, categoria: 'perifericos', imagen: 'default.png', activo: true }
            ]);
            console.log('6 productos iniciales insertados en la base de datos.');
        }
    });
}
catch (error){
    console.error('Error al iniciar el servidor:', error);
    require('process').exit(1);
}