var express = require('express');
var router = express.Router();
var path = require('path');
const mysql = require('mysql2');
const db = require('../db');


const { authenticateManagerToken, authenticateAdminToken } = require('../middleware/authMiddleware');


//受保护的静态文件路由
router.get('/members.html', authenticateManagerToken, function(req, res) {
    res.sendFile(path.join(__dirname, '../public', 'members.html'));
});

router.get('/events.html', authenticateManagerToken, function(req, res) {
    res.sendFile(path.join(__dirname, '../public', 'events.html'));
});

router.get('/updates.html', authenticateManagerToken, function(req, res) {
    res.sendFile(path.join(__dirname, '../public', 'updates.html'));
});

router.get('/manager.html', authenticateAdminToken, function(req, res) {
    res.sendFile(path.join(__dirname, '../public', 'manager.html'));
});

router.get('/organization.html', authenticateAdminToken, function(req, res) {
    res.sendFile(path.join(__dirname, '../public', 'organization.html'));
});

router.get('/branch.html', authenticateAdminToken, function(req, res) {
    res.sendFile(path.join(__dirname, '../public', 'branch.html'));
});

router.get('/admin.html', authenticateAdminToken, function(req, res) {
    res.sendFile(path.join(__dirname, '../public', 'manager.html'));
});


// 配置静态文件服务
router.use(express.static(path.join(__dirname, '../public')));

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../public', '/index.html'));
   });

router.get('/home', function(req, res) {
    res.sendFile(path.join(__dirname, '../public', '/index.html'));
   });

router.get('/location', function(req, res) {
    res.sendFile(path.join(__dirname, '../public', '/location.html'));
   });

// router.get('/contact', function(req, res) {
//     res.sendFile(path.join(__dirname, '../public', '/contact.html'));
//    });

router.get('/api/branches', (req, res) => {
    db.query('SELECT * FROM Branches', (err, result) => {
        if (err) throw err;
        // console.log("Fetched data:", result);
        res.json(result);
    });
});



















module.exports = router;