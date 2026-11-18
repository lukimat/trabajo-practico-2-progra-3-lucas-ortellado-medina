const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Producto, Usuario } = require('../modelos/index.js');

const SECRETO_JWT = 'clave_secreta_ortech_2026';

const mostrarLogin = (req, res) => {
    res.render('login', { error: null });
};

const procesarLogin = async (req, res) => {
    try {
        const { correo, password } = req.body;

        if (!correo || !password || !correo.includes('@') || password.trim().length < 4 || password.length > 30) {
            return res.render('login', { error: 'Formato de correo o contraseña inválido' });
        }

        const usuario = await Usuario.findOne({ where: { correo } });

        if (!usuario) {
            return res.render('login', { error: 'Correo o contraseña incorrectos' });
        }

        const passwordValido = await bcrypt.compare(password, usuario.password);
        if (!passwordValido) {
            return res.render('login', { error: 'Correo o contraseña incorrectos' });
        }

        const token = jwt.sign(
            { id: usuario.id, correo: usuario.correo },
            SECRETO_JWT,
            { expiresIn: '15m' }
        );

        res.cookie('tokenAdmin', token, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000
        });

        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error(error);
        res.render('login', { error: 'Error al iniciar sesión' });
    }
};

const cerrarSesion = (req, res) => {
    res.clearCookie('tokenAdmin');
    res.redirect('/admin/login');
};

const verificarSesion = (req, res, next) => {
    const token = req.cookies.tokenAdmin;
    if (!token) {
        return res.redirect('/admin/login');
    }

    try {
        const payload = jwt.verify(token, SECRETO_JWT);
        
        const nuevoToken = jwt.sign(
            { id: payload.id, correo: payload.correo },
            SECRETO_JWT,
            { expiresIn: '15m' }
        );

        res.cookie('tokenAdmin', nuevoToken, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000
        });

        req.usuario = payload;
        next();
    } catch (error) {
        res.clearCookie('tokenAdmin');
        return res.redirect('/admin/login');
    }
};

const mostrarDashboard = async (req, res) => {
    try {
        const productos = await Producto.findAll();
        res.render('dashboard', { productos });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar el panel');
    }
};

const mostrarFormularioNuevo = (req, res) => {
    res.render('formulario', { producto: null });
};

const crearProducto = async (req, res) => {
    try {
        const { nombre, precio, categoria } = req.body;
        const imagen = req.file ? req.file.filename : 'default.png';

        await Producto.create({
            nombre,
            precio,
            categoria,
            imagen,
            activo: true
        });

        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear el producto');
    }
};

const mostrarFormularioEditar = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) {
            return res.redirect('/admin/dashboard');
        }
        res.render('formulario', { producto });
    } catch (error) {
        console.error(error);
        res.redirect('/admin/dashboard');
    }
};

const actualizarProducto = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (producto) {
            const { nombre, precio, categoria } = req.body;
            const imagen = req.file ? req.file.filename : producto.imagen;

            await producto.update({
                nombre,
                precio,
                categoria,
                imagen
            });
        }
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar el producto');
    }
};

const cambiarEstadoProducto = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (producto) {
            await producto.update({ activo: !producto.activo });
        }
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cambiar estado del producto');
    }
};

module.exports = {
    mostrarLogin,
    procesarLogin,
    cerrarSesion,
    verificarSesion,
    mostrarDashboard,
    mostrarFormularioNuevo,
    crearProducto,
    mostrarFormularioEditar,
    actualizarProducto,
    cambiarEstadoProducto
};