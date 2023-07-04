const http = require('http');
const path = require('path');
const mysql2 = require('mysql2');
const csrf = require('csurf');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const flash = require('connect-flash');

const sequelize = require('./utils/database');
const Student = require('./models/student');
const Course = require('./models/course');
const StudentCourse = require('./models/StudentCourse');
const CourseContent = require('./models/course-content');
const StudentRoutes = require('./routes/student');
const CourseRoutes = require('./routes/course');
const AuthRoutes = require('./routes/auth');
const AdminRoutes = require('./routes/admin');


app.use(bodyParser.urlencoded({ extended: false }));

const multer = require('multer');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/webp'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('file'));
// app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('file'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'assets')));

app.set('view engine', 'ejs');
app.set('views', 'views');

const session = require('express-session');
const mysqlStore = require('express-mysql-session')(session);
const options = {
    connectionLimit: 10,
    password: 'new_user@123',
    user: 'root',
    database: 'session',
    host: 'localhost',
    port: 3306,
    createDatabaseTable: true
}
const sessionStore = new mysqlStore(options);
app.use(session({
    name: "worldclass",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    secret: 'asdfghjkl',
    cookie: {
        httpOnly: true,
        maxAge: 3600000,
        sameSite: true
        // secure: IN_PROD
    }
}));

const csrfProtection = csrf({ cookie: false });
app.use(csrfProtection);
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use(flash());

Student.hasMany(StudentCourse, { foreignKey: 'StudentEmail', constraints: true, onDelete: 'CASCADE' });
Course.hasMany(CourseContent, { foreignKey: 'name' });

app.use('/student', StudentRoutes);
app.use('/courses', CourseRoutes);

app.use(AuthRoutes);
app.use(AdminRoutes);

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

const server = http.createServer(app);
sequelize.sync()
    .then(result => {
        server.listen(3000);
    })
    .catch((err) => {
        console.log(err);
    });