const express = require('express');
const router = express.Router();
const is_auth = require('../middleware/is_Auth');
const StudentController = require('../controllers/student');
const { check, body } = require('express-validator');

router.post('/myEdit', is_auth,
    [
        body('firstname')
        .isAlpha()
        .notEmpty(),

        body('surname')
        .isAlpha()
        .notEmpty(),
        
        body('degree')
        .isString()
        .notEmpty()
    ],
    StudentController.postEditStudent
);

router.get('/myEdit', is_auth, StudentController.getEditStudent);

router.get('/my', is_auth, StudentController.getStudent);

router.get('/dashboard', is_auth, StudentController.getDashboard);

router.get('/courses/:coursename/:instructor', is_auth, StudentController.EnrollCourse);

module.exports = router;