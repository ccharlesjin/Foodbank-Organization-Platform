const express = require('express');
const mysql = require('mysql2');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// const notificationRoutes = require('./notificationRoutes');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser());

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var managerRouter = require('./routes/manager');
var adminRouter = require('./routes/admin');
var userRouter = require('./routes/user');

const { authenticateUserToken, authenticateManagerToken, authenticateAdminToken } = require('./middleware/authMiddleware');

app.use('/manager', authenticateManagerToken, managerRouter);
app.use('/admin', authenticateAdminToken, adminRouter);
app.use('/users', usersRouter);
app.use('/user', authenticateUserToken, userRouter);
app.use('/', indexRouter);

module.exports = app;
app.listen(3018, () => {
    console.log('Server is running on http://localhost:3018');
});