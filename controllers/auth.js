const Student = require('../models/student');
const Courses = require('../models/course');
const StudentCourses = require('../models/StudentCourse');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');


exports.getRegister = (req, res, next) => {

    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render('auth/register', {
        pageTitle: 'Register',
        errorMessage: {
            email: message
        },
        oldInput: {
            name: '',
            degree: '',
            gender: '',
            email: '',
            password: ''
        },
        validationErrors: []
    });
};


exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render('auth/signin', {
        pageTitle: 'Login',
        errorMessage: {
            email: message
        },
        oldInput: {
            email: '',
            password: ''
        },
        validationErrors: []
    });
};


exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    let messages = {};
    errors.array().map(({ param, msg }) => {
        messages[param] = msg;
    })

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/signin', {
            pageTitle: 'Login',
            errorMessage: messages,
            oldInput: {
                email: email,
                password: password
            },
            validationErrors: errors.array()
        });
    }

    Student.findByPk(email)
        .then(user => {
            if (!user) {
                req.flash('error', 'No account with that email found.');
                return res.redirect('/');
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        if (user.name === 'admin') {
                            return res.redirect('/admin');
                        } else {
                            let completedCourses;
                            StudentCourses.findAll({ where: { completed: true, StudentEmail: req.session.user.email } })
                                .then((result) => {
                                    console.log(result)
                                    completedCourses = result
                                    return Courses.findAll({ limit: 6, order: [['createdAt', 'DESC']] });
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
                                .catch((err) => {
                                    console.log(err);
                                    res.redirect('/');
                                })
                        }

                    } else {
                        req.flash('error', 'Invalid username or password.');
                        return res.redirect('/');
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/');
                });
        })
        .catch(err => {
            console.log(err);
            res.redirect('/');
        });
}


exports.postRegister = (req, res, next) => {
    const name = req.body.name;
    const degree = req.body.degree;
    const gender = req.body.gender;
    const email = req.body.email;
    const password = req.body.password;
    const image = req.file.path;

    const errors = validationResult(req);
    let messages = {};
    errors.array().map(({ param, msg }) => {
        messages[param] = msg;
    });

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/register', {
            pageTitle: 'Register',
            errorMessage: messages,
            oldInput: {
                name: name,
                degree: degree,
                gender: gender,
                email: email,
                password: password
            },
            validationErrors: errors.array()
        });
    }

    Student.findByPk(email)
        .then((result) => {
            if (result) {
                req.flash('error', 'Account with that email already exists!');
                return res.redirect('/register');
            }
        })

    bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
            Student.create({
                name: name,
                degree: degree,
                gender: gender,
                email: email,
                password: hashedPassword,
                photo: image
            })
                .then(result => {
                    req.session.isLoggedIn = true;
                    req.session.user = result;
                    if (result.name === "admin") {
                        res.redirect('/admin');
                    } else {
                        let completedCourses;
                        StudentCourses.findAll({ where: { completed: true, StudentEmail: req.session.user.email } })
                            .then((result) => {
                                completedCourses = result
                                return Courses.findAll({ limit: 6, order: [['createdAt', 'DESC']] });
                            })
                            .then((courses) => {
                                res.render('students/main', {
                                    pageTitle: 'Profile',
                                    name: name,
                                    degree: degree,
                                    username: req.session.user.name,
                                    profileImage: image,
                                    completedCourses: completedCourses,
                                    newCourses: courses
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                                res.redirect('/');
                            })
                    }
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
}


exports.getLogout = (req, res, next) => {
    req.session.isLoggedIn = false;
    res.redirect('/');
}