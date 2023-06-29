const express = require('express');
const router = express.Router();
const is_auth = require('../middleware/is_Auth');
const { check, body } = require('express-validator');
const AdminController = require('../controllers/admin');

router.get('/admin', is_auth, AdminController.getAdmin);

router.post('/admin/create', is_auth,
    [
        body('name')
            .exists()
            .notEmpty()
            .custom((value) => {
                return value.match(/^[A-Za-z ]+$/);
            }),

        body('instructor')
            .notEmpty()
            .custom((value) => {
                return value.match(/^[A-Za-z ]+$/);
            }),

        body('duration')
            .notEmpty()
            .isInt(),

        body('start_date')
            .notEmpty()
            .custom((value, { req }) => {
                var date_regex = /^\d{4}\-(0?[1-9]|1[012])$/;
                return date_regex.test(value);
            }),

        body('end_date')
            .notEmpty()
            .custom((value, { req }) => {
                if (value === req.body.start_date) {
                    throw new Error('Start and End date can not match!');
                }
                return true;
            })
            .custom((value, { req }) => {
                var date_regex = /^\d{4}\-(0?[1-9]|1[012])$/;
                return date_regex.test(value);
            }),
    ],
    AdminController.CreateCourse
);

router.get('/admin/delete/:name', is_auth, AdminController.deleteCourse);


module.exports = router;