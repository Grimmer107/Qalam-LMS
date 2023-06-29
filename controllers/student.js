const Student = require('../models/student');
const StudentCourse = require('../models/StudentCourse');
const Courses = require('../models/course');
const { validationResult } = require('express-validator');

exports.getDashboard = (req, res, next) => {
    let completedCourses;
    Student.findByPk(req.session.user.email)
    .then((user) => {
        return StudentCourses.findAll({where: {completed: true, StudentEmail: req.session.user.email}})
    })
    .then((result) => {
        completedCourses = result
        return Courses.findAll({ limit: 6, order: [['createdAt', 'DESC']]});
    })
    .then((courses) => {
        res.render('students/main', {
            pageTitle: 'Profile',
            name: user.name,
            degree: user.degree,
            username: req.session.user.name, 
            profileImage: user.photo,
            completedCourses: completedCourses,
            newCourses: courses
        });
    })
    .catch(err => {
        console.log(err);
        res.redirect('/');
    });
}

exports.getEditStudent = (req, res, next) => {

    const name = req.query.firstname + ' ' + req.query.surname;
    res.render('students/edit-Student-Profile', {
        pageTitle: 'Edit Profile',
        username: req.session.user.name,
        errorMessage: {},
        validationErrors: [],
        name: name,
        firstname: req.query.firstname,
        lastname: req.query.surname,
        profileImage: req.session.user.photo,
        degree: req.query.degree,
        email: req.query.email,
        gender: req.query.gender
    })
}

exports.postEditStudent = (req, res, next) => {
    const degree = req.body.degree;
    const email = req.body.email;
    const gender = req.body.gender;
    const photo = req.session.user.photo;

    let surname = req.body.surname;
    let firstname = req.body.firstname;

    const errors = validationResult(req);
    let messages = {};
    errors.array().map(({param, msg}) => {
        messages[param] = msg;
    });

    if (!errors.isEmpty()) {
        return res.status(422).render('students/edit-Student-Profile', {
            pageTitle: 'Edit Profile',
            username: req.session.user.name,
            errorMessage: messages,
            validationErrors: errors.array(),
            name: firstname + ' ' + surname,
            firstname: firstname,
            lastname: surname,
            profileImage: photo,
            degree: degree,
            email: email,
            gender: gender
        })
    }

    Student.findByPk(email)
    .then(student => {
        let firstname = req.body.firstname || student.name.split(' ')[0]
        let surname = req.body.lastname || student.name.split(' ')[1]
        const name = firstname  + ' ' + surname;
        
        student.name = name || student.name;
        student.photo = photo || student.photo;
        student.degree = degree || student.degree;
        student.email = email || student.email;
        student.gender = gender || student.gender;
        return student.save()
    })
    .then(result => {
        [firstname, surname] = result.name.split(' ');
        res.render('students/student-profile', {
            pageTitle: 'Edit Profile',
            username: req.session.user.name,
            errorMessage: messages,
            validationErrors: errors.array(),
            name: result.name,
            firstname: firstname,
            lastname: surname,
            profileImage: req.session.user.photo,
            degree: result.degree,
            email: result.email,
            gender: result.gender
        })
    })
    .catch(err => {
        console.log(err);
    })
};

exports.getStudent = (req, res, next) => {
    Student.findByPk(req.session.user.email)
    .then(result => {
        [firstname, surname] = result.name.split(' ');
        res.render('students/student-profile', {
            pageTitle: 'Edit Profile',
            username: req.session.user.name,
            name: result.name,
            firstname: firstname,
            lastname: surname,
            profileImage: result.photo,
            degree: result.degree,
            email: result.email,
            gender: result.gender
        })
    })
    .catch(err => {
        console.log(err);
    })
};

exports.EnrollCourse = (req, res, next) => {
    let completedCourses;
    StudentCourse.create({
        StudentName: req.session.user.name,
        StudentEmail: req.session.user.email,
        CourseName: req.params.coursename,
        instructor: req.params.instructor,
        completed: false
    })
    .then((studentCourse) => {
        return StudentCourses.findAll({where: {completed: true, StudentEmail: req.session.user.email}})
    })
    .then((result) => {
        completedCourses = result
        return Courses.findAll({ limit: 6, order: [['createdAt', 'DESC']]});
    })
    .then((courses) => {
        res.render('students/main', {
            pageTitle: 'Profile',
            name: req.session.user.name,
            degree: req.session.user.degree,
            username: req.session.user.name, 
            profileImage: req.session.user.photo,
            completedCourses: completedCourses,
            newCourses: courses
        });
    })
    .catch(err => {
        console.log(err);
        res.redirect('/');
    });
}