const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const adminController = require('../controladores/adminController.js');

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../contenido_estatico/img'),
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const nombreUnico = crypto.randomUUID() + extension;
        cb(null, nombreUnico);
    }
});

const fileFilter = (req, file, cb) => {
    const tiposValidos = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (tiposValidos.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Formato de imagen no válido'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
});

router.get('/login', adminController.mostrarLogin);
router.post('/login', adminController.procesarLogin);
router.get('/logout', adminController.cerrarSesion);

router.get('/dashboard', adminController.verificarSesion, adminController.mostrarDashboard);
router.get('/productos/nuevo', adminController.verificarSesion, adminController.mostrarFormularioNuevo);
router.post('/productos/nuevo', adminController.verificarSesion, upload.single('imagen'), adminController.crearProducto);

router.get('/productos/editar/:id', adminController.verificarSesion, adminController.mostrarFormularioEditar);
router.post('/productos/editar/:id', adminController.verificarSesion, upload.single('imagen'), adminController.actualizarProducto);

router.post('/productos/estado/:id', adminController.verificarSesion, adminController.cambiarEstadoProducto);

module.exports = router;