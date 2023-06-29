const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const { check, body } = require('express-validator');
const AuthController = require('../controllers/auth');

router.get('/register', AuthController.getRegister);

router.get('/', AuthController.getLogin);

router.get('/logout', AuthController.getLogout);

router.post('/',
    [
        body('email')
            .isEmail()
            .withMessage('Invalid username or password.')
            .normalizeEmail(),
        body('password', 'Invalid username or password.')
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim()
    ],
    AuthController.postLogin
);

router.post('/register',
    [
        body('name')
        .notEmpty()
        .isString(),

        body('degree')
        .notEmpty()
        .isString(),

        body('email')
        .notEmpty()
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .custom((value, { req }) => {
            return Student.findByPk(value)
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject(
                            'E-Mail exists already, please pick a different one.'
                        );
                    }
                });
        })
        .normalizeEmail(),

        body('password', 'Password must have at least 5 alphanumeric digits.')
        .notEmpty()
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim(), 
    ],
    AuthController.postRegister
);


module.exports = router;