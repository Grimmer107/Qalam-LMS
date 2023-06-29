const Sequelize = require('sequelize');

const sequelize = new Sequelize('lms', 'root', 'new_user@123', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;