const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Producto = sequelize.define('Producto', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    categoria: { 
        type: DataTypes.ENUM('componentes', 'perifericos'), 
        allowNull: false 
    },
    imagen: { type: DataTypes.STRING(255), defaultValue: 'default.png' },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'productos', timestamps: false });


const Usuario = sequelize.define('Usuario', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    correo: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false } // bcryptjs
}, { tableName: 'usuarios', timestamps: false });


const Venta = sequelize.define('Venta', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombreCliente: { type: DataTypes.STRING(100), allowNull: false },
    fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    total: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, { tableName: 'ventas', timestamps: false });

const VentaProducto = sequelize.define('VentaProducto', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cantidad: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    precioUnitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, { tableName: 'venta_productos', timestamps: false });

Venta.belongsToMany(Producto, { through: VentaProducto, foreignKey: 'ventaId', as: 'productos' });
Producto.belongsToMany(Venta, { through: VentaProducto, foreignKey: 'productoId', as: 'ventas' });

module.exports = { sequelize, Producto, Usuario, Venta, VentaProducto };