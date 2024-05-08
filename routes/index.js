var express = require('express');
var router = express.Router();
var path = require('path');
const mysql = require('mysql2');
// router.get('/location.html', function(req, res) {

//     res.sendFile(path.join(__dirname, '../public', '/location.html'));
//     console.log('111111111111');
//    });

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