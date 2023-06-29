const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Course = sequelize.define('course', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    instructor: {
        type: Sequelize.STRING
    },
    photo: {
        type: Sequelize.STRING,
        allowNull: true
    },
    duration: Sequelize.INTEGER,
    start_date: {
        type: Sequelize.STRING,
        allowNull: false
    },
    end_date: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Course;