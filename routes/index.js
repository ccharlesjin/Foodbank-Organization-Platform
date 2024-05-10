var express = require('express');
var router = express.Router();
var path = require('path');
const mysql = require('mysql2');
const db = require('../db');


// 配置静态文件服务
router.use(express.static(path.join(__dirname, '../public')));
router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../public', '/index.html'));
   });

router.get('/api/branches', (req, res) => {
    db.query('SELECT * FROM Branches', (err, result) => {
        if (err) throw err;
        // console.log("Fetched data:", result);
        res.json(result);
    });
});



















module.exports = router;