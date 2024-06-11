var express = require('express');
var router = express.Router();
var path = require('path');
const crypto = require('crypto');
const db = require('../db');
const { TwitterApi } = require('twitter-api-v2');
const { sendEmail } = require('../emailService');
// const { authenticateUserToken } = require('../middleware/authMiddleware');
const twitterClient = new TwitterApi({
    appKey: 'Xso7vaPY6aUciaFUrjuSQkpcb',
    appSecret: 'aDgRAODetYs4gM7zHJJ1hZy0KV6j69pRV4qeT4ARsdQBYW0VHX',
    accessToken: '1792569146322137089-eqnQ8w620D3OkbWbTK6y3u1LJM1LnU',
    accessSecret: 'iOBKbdpZA8fFyGKLLg89BFviC6hSlYaEedm3TxNJoJEKx',
  });

// 创建一个读写权限的客户端
const rwClient = twitterClient.readWrite;
const generateHash = (password, salt = '10') => {
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash ;
};

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../public', '/Profile.html'));
});

router.get('/Profile', function(req, res) {
    res.sendFile(path.join(__dirname, '../public', '/Profile.html'));
});

router.get('/activities', function(req, res) {
    res.sendFile(path.join(__dirname, '../public', '/user_activity.html'));
});

router.get('/announcements', function(req, res) {
    res.sendFile(path.join(__dirname, '../public', '/user_announcements.html'));
});

router.get('/manager.css', function(req, res) {
    res.sendFile(path.join(__dirname, '../public', '/manager.css'));
});

// 设置路由以提供成员数据
router.get('/api/user_info', (req, res) => {
    const sqlQuery = `SELECT user_id, branch_id, email, full_name, phone_number, user_id, user_name FROM User WHERE user_id = ?`;
    db.query(sqlQuery, [req.user.user_id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).send('Internal server error');
            return;
        }
        res.json(result);
    });
});


router.get('/logout', (req, res) => {
    // 清除JWT cookie
    res.cookie('jwt', '', {
        expires: new Date(0),
        path: '/',       // 如果设置时指定了路径，这里也需要指定相同的路径
        secure: true,    // 如果设置时指定了仅在HTTPS下有效，这里也需要指定
        httpOnly: true,  // 如果设置时指定了HTTP Only，这里也需要指定
        sameSite: 'strict' // 如果设置时使用了sameSite属性，这里也需要保持一致
    });
    console.log("Cookies should not be available:", req.cookies);
    res.status(200).send("Logged out");
    // res.redirect('/manager_login.html');
});


router.get('/api/branch_id', (req, res) => {
    if (req.user.branch_id) {
        // 正确的分支 ID 存在，返回这个 ID
        return res.json([req.user.branch_id]); // 使用 return 确保函数在此结束
    } else {
        // 分支 ID 不存在，返回一个 500 错误
        return res.status(404).send('Branch ID not found');
    }
});

router.get('/api/user_id', (req, res) => {
    if (req.user.user_id) {
        // 正确的分支 ID 存在，返回这个 ID
        return res.json([req.user.user_id]); // 使用 return 确保函数在此结束
    } else {
        // 分支 ID 不存在，返回一个 500 错误
        return res.status(404).send('Branch ID not found');
    }
});

router.get('/api/User', (req, res) => {

    const sqlQuery = `
        SELECT user_id, user_name, branch_id
        FROM User WhERE branch_id = ?
    `;
    db.query(sqlQuery, [req.user.branch_id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ message: 'Error retrieving User' });
            return;
        }
        res.json(result);  // 将查询结果以 JSON 格式发送
    });
});

//Updates
router.get('/api/updates', (req, res) => {
    const sqlQuery = `SELECT * FROM Updates WHERE branch_id = ?`;
    db.query(sqlQuery, [req.user.branch_id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).send('Internal server error');
            return;
        }
        res.json(result);
    });
});

router.get('/api/user/:user_id', (req, res) => {
    const userId = req.params.user_id;
    console.log(`Token for user ${userId}:`, req.headers['authorization']);
    const sql = `
        SELECT u.user_name, u.email, u.full_name, u.phone_number, b.branch_name AS organization
        FROM User u
        JOIN branches b ON u.branch_id = b.branch_id
        WHERE u.user_id = ?
    `;

    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ success: false, message: 'Database query failed' });
        }
        if (result.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, data: result[0] });
    });
});

router.put('/api/user/:user_id', (req, res) => {
    const userId = req.params.user_id;
    const { user_name, email, full_name, phone_number } = req.body;
    console.log('UserId:', userId);
    console.log('user_name:', user_name);
    console.log('phone_number:', phone_number);
    const sql = `
        UPDATE User
        SET user_name = ?, email = ?, full_name = ?, phone_number = ?
        WHERE user_id = ?
    `;
    db.query(sql, [user_name, email, full_name, phone_number, userId], (err, result) => {
        console.log('User id:', userId);
        if (err) {
        console.error('Database update error:', err);
        return res.status(500).json({ success: false, message: 'Database update failed' });
        }
        res.json({ success: true, message: 'User information updated successfully', data: req.body });
    });
});

router.get('/api/user/:user_id/password', (req, res) => {
    const userId = req.params.user_id;
    const sql = `
        SELECT password
        FROM User
        WHERE user_id = ?
    `;
    db.query(sql, [userId], (err, result) => {
        if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ success: false, message: 'Database query failed' });
        }
        if (result.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, data: result[0] });
    });
});

router.post('/api/user/changePassword', (req, res) => {
    const userId = req.user.user_id;
    const { newPassword } = req.body;
    console.log('user id:', userId);
    console.log('new password:', newPassword);

    try {
        const hashedPassword = generateHash(newPassword);
        console.log('hashed password:', hashedPassword);
        const sql = `
            UPDATE User
            SET password = ?
            WHERE user_id = ?
        `;
        db.query(sql, [hashedPassword, userId], (err, result) => {
            if (err) {
                console.error('Database update error:', err);
                return res.status(500).json({ success: false, message: 'Database update failed' });
            }
            res.json({ success: true, message: 'Password updated successfully' });
        });
    } catch (err) {
        console.error('Error hashing password:', err);
        return res.status(500).json({ success: false, message: 'Error hashing password' });
    }
});

router.get('/api/managers', (req, res) => {

    const sqlQuery = `
        SELECT user_id, user_name
        FROM Manager WhERE branch_id = ?
    `;
    db.query(sqlQuery, [req.user.branch_id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ message: 'Error retrieving manager' });
            return;
        }
        res.json(result);  // 将查询结果以 JSON 格式发送
    });
});

router.get('/api/activities', (req, res) => {
    console.log('Getting activities');
      const branchID = req.user.branch_id;
      console.log('branchID:', branchID);
      const sqlQuery = `SELECT * FROM Activity WHERE branch_id = ?`;

      db.query(sqlQuery, [branchID], (err, results) => {
        if (err) {
          console.error('Database error:', err);
          res.status(500).send('Internal server error');
          return;
        }
        res.json(results);
      });
    });

router.get('/api/user_activities', (req, res) => {
        const userId = req.user.user_id;
        console.log('user_id:', userId);
        const sqlQuery = `SELECT activity_id FROM User_in_activities WHERE user_id = ?`;

        db.query(sqlQuery, [userId], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                res.status(500).send('Internal server error');
                return;
            }
            res.json(results);
        });
    });

router.post('/api/join_activity', (req, res) => {
    const { user_id, activity_id, remarks } = req.body;
    const userId = req.user.user_id;
    const sqlQuery = `INSERT INTO User_in_activities (user_id, activity_id, remarks) VALUES (?, ?, ?)`;

    db.query(sqlQuery, [userId, activity_id, remarks], (err, result) => {
        if (err) {
            console.error('Database insert error:', err);
            res.status(500).send('Internal server error');
            return;
        }
        res.json({ message: '成功参加该活动' });
    });
});

router.post('/api/leave_activity', (req, res) => {
    const { user_id, activity_id } = req.body;
    const userId = req.user.user_id;
    const sqlQuery = `DELETE FROM User_in_activities WHERE user_id = ? AND activity_id = ?`;

    db.query(sqlQuery, [userId, activity_id], (err, result) => {
        if (err) {
            console.error('Database delete error:', err);
            res.status(500).send('Internal server error');
            return;
        }
        res.json({ message: '已成功退出活动' });
    });
});

module.exports = router;