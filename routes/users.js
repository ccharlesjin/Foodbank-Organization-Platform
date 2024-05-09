var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
const db = require('../db');
var path = require('path');

// 配置静态文件服务
router.use(express.static(path.join(__dirname, '../public')));


router.post('/user_login', function(req, res, next) {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.execute(sql, [email, password], (error, results) => {
      if (error) {
          res.send('Error during login: ' + error.message);
          return;
      }
      if (results.length > 0) {

          res.send('Login successful!');
          // 登陆成功跳转more_detail页面
          res.sendFile(path.join(__dirname, '../public', '/more_detail.html'));

      } else {
          res.send('Username or password is incorrect');
      }
  });

  //  console.log(email);
});

module.exports = router;