var express = require('express');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    database: 'FoodBank'
});
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to database with thread ID: ' + db.threadId);
});

module.exports = db;
