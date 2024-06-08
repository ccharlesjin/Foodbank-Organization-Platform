// notificationRoutes.js
const express = require('express');
const router = express.Router();
const db = require('./db');
const { sendEmail } = require('./emailService');

// 发送通知的路由
router.post('/send-notification', (req, res) => {
    const { userId, branchId, notificationType } = req.body;

    // 查询用户的邮箱地址
    const getUserEmailQuery = 'SELECT email FROM User WHERE user_id = ?';
    db.query(getUserEmailQuery, [userId], (err, userResult) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ message: 'Error fetching user email' });
            return;
        }

        if (userResult.length === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const userEmail = userResult[0].email;

        // 查询分支的名称
        const getBranchNameQuery = 'SELECT branch_name FROM Branches WHERE branch_id = ?';
        db.query(getBranchNameQuery, [branchId], (err, branchResult) => {
            if (err) {
                console.error('Database error:', err);
                res.status(500).json({ message: 'Error fetching branch name' });
                return;
            }

            if (branchResult.length === 0) {
                res.status(404).json({ message: 'Branch not found' });
                return;
            }

            const branchName = branchResult[0].branch_name;

            // 发送电子邮件
            const subject = `New ${notificationType} from ${branchName}`;
            const text = `You have a new ${notificationType} from ${branchName}. Check it out!`;

            sendEmail(userEmail, subject, text);

            res.json({ message: 'Notification sent successfully' });
        });
    });
});

module.exports = router;
