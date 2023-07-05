const express = require('express');
const router = express.Router();
const is_auth = require('../middleware/is_Auth');
const CourseController = require('../controllers/course');

router.get('/course/download/uploads/:filename', is_auth, CourseController.getFile);

router.get('/course/uploads/delete', is_auth, CourseController.deleteFile)

router.get('/', is_auth, CourseController.getCourses);

router.post('/course/upload', is_auth, CourseController.postFile);

router.get('/course/:coursename', is_auth, CourseController.getCourse);

router.get('/completed', is_auth, CourseController.getCompletedCourses);

router.post('/course/completed/:coursename', is_auth, CourseController.markAsCompleted)

module.exports = router;