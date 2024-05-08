const express = require('express');
const mysql = require('mysql2');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const path = require('path');

const app = express();

app.use('/', indexRouter);

app.use('/users', usersRouter);

module.exports = app;
app.listen(3010, () => {
    console.log('Server is running on http://localhost:3010');
});