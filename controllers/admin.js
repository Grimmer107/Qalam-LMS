const Course = require('../models/course');
const { validationResult } = require('express-validator');

exports.getAdmin = (req, res, next) => {
    let fetchedCourses = [];
    Course.findAll({attributes: ['name', 'instructor', 'photo']})
    .then(courseData => {
        for (let data of courseData) {
            fetchedCourses.push(data.dataValues);
        }
        res.render('admin/admin', {
            pageTitle: 'Admin Login',
            courses: fetchedCourses,
            error: false
        });
    })
    .catch(err => {
        console.log(err);
        res.render('admin/admin', {
            pageTitle: 'Admin Login', 
            courses: fetchedCourses,
            error: false
        });
    });
};

exports.CreateCourse = (req, res, next) => {

    const coursename = req.body.name; 
    const instructor = req.body.instructor;
    const startdate = req.body.start_date;
    const enddate = req.body.end_date;
    const photo = req.body.photo;

    const errors = validationResult(req);
    console.log(errors);
    let fetchedCourses = [];
    if (!errors.isEmpty()) {

        Course.findAll({attributes: ['name', 'instructor', 'photo']})
        .then(courseData => {
            for (let data of courseData) {
                fetchedCourses.push(data.dataValues);
            }
            return res.render('admin/admin', {
                pageTitle: 'Admin Login',
                courses: fetchedCourses,
                error: true
            });
        });
    }

    else {
        Course.create({
            name: coursename,
            instructor: instructor,
            start_date: startdate,
            end_date: enddate,
            photo: photo
        })
        .then(course => {
            return Course.findAll({attributes: ['name', 'instructor', 'photo']})
        })
        .then(courseData => {
            for (let data of courseData) {
                fetchedCourses.push(data.dataValues);
            }
            res.render('admin/admin', {
                pageTitle: 'Admin Login',
                courses: fetchedCourses,
                error: false
            });
        })
        .catch(err => {
            console.log(err);
            res.render('admin/admin', {
                pageTitle: 'Admin Login', 
                courses: fetchedCourses, 
                error: false
            });
        });
    }
}

exports.deleteCourse = (req, res, next) => {
    let fetchedCourses = [];
    Course.findByPk(req.params.name)
    .then(course => {
        return course.destroy();
    })
    .then(result => {
        return Course.findAll({attributes: ['name', 'instructor', 'photo']})
    })
    .then(courseData => {
        for (let data of courseData) {
            fetchedCourses.push(data.dataValues);
        }
        res.render('admin/admin', {
            pageTitle: 'Admin Login',
            courses: fetchedCourses,
            error: false,
        });
    })
    .catch(err => {
        console.log(err);
        res.render('admin/admin', {
            pageTitle: 'Admin Login', 
            courses: fetchedCourses,
            error: false
        });
    });
}