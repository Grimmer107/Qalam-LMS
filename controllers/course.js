const CourseContent = require('../models/course-content');
const Course = require('../models/course');
const fs = require('fs');
const path = require('path');

exports.getFile = (req, res, next) => {
    console.log(req.params.filename);
    const filepath = path.join('uploads', req.params.filename);
    const file = fs.createReadStream(filepath);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition','attachment; filename="' + req.params.filename + '"');
    res.setHeader('filename', `${req.params.filename}.pdf`);
    file.pipe(res);
};

exports.postFile = (req, res, next) => {
    const coursename = req.body.coursename;
    const file = req.file;
    const filepath = file.path;
    CourseContent.create({
        name: coursename,
        coursefile: filepath
    })
    .then(result => {
        console.log(result.coursefile);
        res.redirect(`/courses/course/${coursename}`);
    })
    .catch(err => console.log(err));
}

exports.deleteFile = (req, res, next) => {
    let filename = req.query.filename;
    let coursename = req.query.coursename;
    let filepath = `uploads` + "\\" + `${filename}`;
    CourseContent.findAll({where: {name: coursename, coursefile: filepath}})
    .then(result => {
        result = result[0]
        result.destroy();
        try {
            let path_to_file = path.join('..', 'uploads', filename);
            fs.unlink(path_to_file);
        } catch (err) {
            console.log('No file found!');
        }
        res.redirect(`/courses/course/${coursename}`);
    })
    .catch(err => console.log(err));
}

exports.getCourse = (req, res, next) => {
    CourseContent.findAll({where: {name: req.params.coursename}})
    .then(result => {
        let course_content = [];
        result.map(({coursefile}) => {
            let filename = coursefile.split("\\")[1];
            course_content.push(filename)
        })
        res.render('courses/course-details',{
            pageTitle: 'Course Content',
            coursename: req.params.coursename,
            content: course_content,
            username: req.session.user.name, 
            profileImage: req.session.user.photo
        });
    })
    .catch(err => console.log(err));
};

exports.getCompletedCourses = (req, res, next) => {
    Course.findAll({where: {completed: true}})
    .then(result => {
        console.log(result);
    })
    .catch(err => console.log(err));
};

exports.getCourses = (req, res, next) => {
    let fetchedCourses = [];
    Course.findAll({attributes: ['name', 'instructor', 'photo']})
    .then(courseData => {
        for (let data of courseData) {
            fetchedCourses.push(data.dataValues);
        }
        res.render('courses/courses', {
            pageTitle: 'Courses',
            courses: fetchedCourses,
            username: req.session.user.name,
            profileImage: req.session.user.photo
        });
    })
    .catch(err => console.log(err));
};