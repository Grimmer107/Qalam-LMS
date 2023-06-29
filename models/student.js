const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Student = sequelize.define('student', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    photo: {
        type: Sequelize.STRING
    },
    gender: {
        type: Sequelize.STRING,
        allowNull: false
    },
    degree: {
        type: Sequelize.STRING, 
        allowNull: false
    }, 
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    }, 
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Student;