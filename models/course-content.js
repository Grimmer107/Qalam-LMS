const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const CourseContent = sequelize.define('course-content', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    coursefile: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    }
});

module.exports = CourseContent;