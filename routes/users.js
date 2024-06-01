var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');
router.use(cookieParser());
const db = require('../db');
var path = require('path');

const jwt = require('jsonwebtoken');


const crypto = require('crypto');
// 添加一个密钥用于签名 JWT
// const SECRET_KEY_MANAGER = crypto.randomBytes(32).toString('base64');
// const SECRET_KEY_ADMIN = crypto.randomBytes(32).toString('base64');
const SECRET_KEY_MANAGER = 'manager_secret_key';
const SECRET_KEY_ADMIN = 'admin_secret_key';


// 配置静态文件服务
router.use(express.static(path.join(__dirname, '../public')));

router.get('/profile', function(req, res) {
    res.sendFile(path.join(__dirname, '../public', '/Profile.html'));
});


// 生成盐和哈希函数
const generateHash = (password, salt = '10') => {
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash ;
};

//用户登录
router.post('/user_login', function(req, res) {
    const { email, password } = req.body;
    const hashedPassword = generateHash(password); // 对密码进行哈希处理
    const sql = 'SELECT * FROM User WHERE email = ? AND password = ?';
    db.execute(sql, [email, hashedPassword], (error, results) => {
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
    const hashedPassword = generateHash(password); // 对密码进行哈希处理
    const sql = 'INSERT INTO User (user_name, password, email) VALUES (?, ?, ?)';
    db.execute(sql, [user_name, hashedPassword, email], (error, results) => {
        if (error) {
            res.send('Error during registration: ' + error.message);
            return;
        }
        //注册步骤1完成，继续添加信息
        res.sendFile(path.join(__dirname, '../public', '/AddDetail.html'));
    });
});





//经理登录
router.post('/manager_login', function(req, res) {
    const { email, password } = req.body;
    const hashedPassword = generateHash(password); // 对密码进行哈希处理
    const sqlQuery = 'SELECT User_ID, branch_id FROM Manager WHERE email = ? AND password = ?';
    db.query(sqlQuery, [email, hashedPassword], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
        if (results.length > 0) {
            const user = results[0];
            //console.log(user.User_ID,email,user.branch_id);
            const token = jwt.sign({
                user_id: user.User_ID,
                email: email,
                branch_id: user.branch_id
            }, SECRET_KEY_MANAGER, { expiresIn: '1h' });
            res.cookie('jwt', token, {
                httpOnly: true, // 使 cookie 仅服务器可访问，增加安全性
                secure: true, // 仅通过 HTTPS 发送 cookie
                sameSite: 'strict', // 严格的同站策略，增强 CSRF 保护
                maxAge: 3600000 // 有效期，单位毫秒
            });
            console.log("Sending token:", token); // 添加日志输出token
            res.json({ token: token, message: 'Login successful' });
            return;
        } else {

            res.status(401).send('Username or password is incorrect'); // 使用 401 状态码表示授权失败
            return;
        }
    });
});




  //经理注册
router.post('/manager_register', function(req, res) {
    const { user_name, password, email } = req.body;
    const hashedPassword = generateHash(password); // 对密码进行哈希处理
    const sql = 'INSERT INTO Manager (user_name, password, email) VALUES (?, ?, ?)';
    db.execute(sql, [user_name, hashedPassword, email], (error, results) => {
          if (error) {
              res.send('Error during registration: ' + error.message);
              return;
          }
          //注册步骤1完成，继续添加信息
          res.sendFile(path.join(__dirname, '../public', '/AddDetail.html'));
      });
  });




//管理登录
router.post('/admin_login', function(req, res) {
    const { email, password } = req.body;
    const hashedPassword = generateHash(password); // 对密码进行哈希处理
    const sqlQuery = 'SELECT User_ID, Email FROM Administrator WHERE email = ? AND password = ?';
    db.query(sqlQuery, [email, hashedPassword], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
        if (results.length > 0) {
            const user = results[0];
            const token = jwt.sign({
                user_id: user.User_ID,
                email: email,
            }, SECRET_KEY_ADMIN, { expiresIn: '1h' });
            res.cookie('jwt', token, {
                httpOnly: true, // 使 cookie 仅服务器可访问，增加安全性
                secure: true, // 仅通过 HTTPS 发送 cookie
                sameSite: 'strict', // 严格的同站策略，增强 CSRF 保护
                maxAge: 3600000 // 有效期，单位毫秒
            });
            console.log("Sending token:", token); // 添加日志输出token
            res.json({ token: token, message: 'Login successful' });
            return;
        } else {

            res.status(401).send('Username or password is incorrect'); // 使用 401 状态码表示授权失败
            return;
        }
    });
});

router.get('/:section', function(req, res, next) {
    const section = req.params.section;
    let activitiesHtml;
    switch (section) {
        case 'security':
            // Return content for security settings
            res.send('Email Verified: Yes <br> <button onclick="changePassword()">Change Password</button>');
            break;


        case 'activities':
            // Return content for activities section
            activitiesHtml = `
                <table class="activity-container">
                    <thead>
                        <tr>
                            <th> </th>
                            <th>Activity Name</th>
                            <th>Date</th>
                            <th>Participants</th>
                            <th>Description</th>
                            <th>Join?</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><img src="/images/sydney.jpg" alt="Sydney Activities" class="activity-image"></td>
                            <td>Sydney Beach Cleanup</td>
                            <td>2024-05-15</td>
                            <td>50 participants</td>
                            <td>Help clean up the Sydney beach area.</td>
                            <td><input type="checkbox" class="activity-join" name="joinActivity" value="Sydney"></td>
                        </tr>
                        <tr>
                            <td><img src="/images/melbourne.jpg" alt="Melbourne Activities" class="activity-image"></td>
                            <td>Melbourne Park Music Festival</td>
                            <td>2024-06-20</td>
                            <td>200 participants</td>
                            <td>Enjoy live music in the park.</td>
                            <td><input type="checkbox" class="activity-join" name="joinActivity" value="Melbourne"></td>
                        </tr>
                        <tr>
                            <td><img src="/images/adelaide.jpg" alt="Adelaide Activities" class="activity-image"></td>
                            <td>Adelaide Art Walk</td>
                            <td>2024-07-05</td>
                            <td>80 participants</td>
                            <td>Explore street art around Adelaide.</td>
                            <td><input type="checkbox" class="activity-join" name="joinActivity" value="Adelaide"></td>
                        </tr>
                    </tbody>
                </table>
            `;
            res.send(activitiesHtml);
            break;
        default:
            res.status(404).send('Section not found');
    }
});



module.exports = router;