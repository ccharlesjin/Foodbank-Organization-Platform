var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
const db = require('../db');
var path = require('path');

// 配置静态文件服务
router.use(express.static(path.join(__dirname, '../public')));

//用户登录
router.post('/user_login', function(req, res) {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM User WHERE email = ? AND password = ?';
  db.execute(sql, [email, password], (error, results) => {
      if (error) {
          res.send('Error during login: ' + error.message);
          return;
      }
      if (results.length > 0) {
          // 登陆成功跳转user页面
          //res.sendFile(path.join(__dirname, '../public', '/user.html'));
          //跳转改为前端执行
          res.status(200).json({message: "Login successful!"});
          return;

      } else {
        //   res.send('Username or password is incorrect');
        res.status(401).send('Username or password is incorrect'); // 使用 401 状态码表示授权失败
        return;
      }
  });
});


//用户注册
router.post('/user_register', function(req, res) {
  const { user_name, password, email } = req.body;
    const sql = 'INSERT INTO User (user_name, password, email) VALUES (?, ?, ?)';
    db.execute(sql, [user_name, password, email], (error, results) => {
        if (error) {
            res.send('Error during registration: ' + error.message);
            return;
        }
        //注册步骤1完成，继续添加信息
        res.sendFile(path.join(__dirname, '../public', '/more_details.html'));
    });
});





//经理登录
router.post('/manager_login', function(req, res) {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM Manager WHERE email = ? AND password = ?';
    db.execute(sql, [email, password], (error, results) => {
        if (error) {
            res.send('Error during login: ' + error.message);
            return;
        }
        if (results.length > 0) {
            // 登陆成功跳转user页面
            //res.sendFile(path.join(__dirname, '../public', '/user.html'));
            //跳转改为前端执行
            res.status(200).json({message: "Login successful!"});
            return;

        } else {
          //   res.send('Username or password is incorrect');
          res.status(401).send('Username or password is incorrect'); // 使用 401 状态码表示授权失败
          return;
        }
    });
  });




  //经理注册
router.post('/manager_register', function(req, res) {
    const { user_name, password, email } = req.body;
      const sql = 'INSERT INTO Manager (user_name, password, email) VALUES (?, ?, ?)';
      db.execute(sql, [user_name, password, email], (error, results) => {
          if (error) {
              res.send('Error during registration: ' + error.message);
              return;
          }
          //注册步骤1完成，继续添加信息
          res.sendFile(path.join(__dirname, '../public', '/more_details.html'));
      });
  });




  //管理登录
router.post('/admin_login', function(req, res) {
    const { Email, Password } = req.body;
    const sql = 'SELECT * FROM Administrator WHERE Email = ? AND Password = ?';
    db.execute(sql, [Email, Password], (error, results) => {
        if (error) {
            res.send('Error during login: ' + error.message);
            return;
        }
        if (results.length > 0) {
            // 登陆成功跳转user页面
            //res.sendFile(path.join(__dirname, '../public', '/user.html'));
            //跳转改为前端执行
            res.status(200).json({message: "Login successful!"});
            return;

        } else {
          //   res.send('Username or password is incorrect');
          res.status(401).send('Username or password is incorrect'); // 使用 401 状态码表示授权失败
          return;
        }
    });
  });

module.exports = router;