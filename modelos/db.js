const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('tp_totem_db', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: true 
});

module.exports = sequelize;
