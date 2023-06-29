const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const StudentCourse = sequelize.define('StudentCourse', {
    StudentName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    StudentEmail: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    CourseName: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
    },
    instructor: Sequelize.STRING,
    completed: {
        type: Sequelize.BOOLEAN
    }
});

module.exports = StudentCourse;