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
//   // 定义一个异步函数发送推文
//   const textTweet = async () => {
//     try {
//       // 使用v2 API发送推文
//       await rwClient.v2.tweet("This tweet has been created using nodejs and OAuth 1.0a User Context");

//     } catch (error) {
//       console.error("Error sending tweet:", error);
//     }
// };

//   // 调用函数
//   textTweet();

// const { authenticateManagerToken } = require('../middleware/authMiddleware');

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../public', '/members.html'));
});

router.get('/members', function(req, res) {
    res.sendFile(path.join(__dirname, '../public', '/members.html'));
});

router.get('/profile', function(req, res) {
    res.sendFile(path.join(__dirname, '../public', '/manager_profile.html'));
});

router.get('/activities', function(req, res) {
    res.sendFile(path.join(__dirname, '../public', '/manager_activity.html'));
});

router.get('/new_profile', function(req, res) {
    res.sendFile(path.join(__dirname, '../public', '/NewProfile.html'));
});

router.get('/rsvp', function(req, res) {
    res.sendFile(path.join(__dirname, '../public', '/rsvp.html'));
});

router.get('/events', function(req, res) {
    res.sendFile(path.join(__dirname, '../public', '/events.html'));
});

router.get('/updates', function(req, res) {
    res.sendFile(path.join(__dirname, '../public', '/updates.html'));
});

router.get('/manager.css', function(req, res) {
    res.sendFile(path.join(__dirname, '../public', '/manager.css'));
});

// 设置路由以提供成员数据

router.get('/api/members', (req, res) => {
    const sqlQuery = `SELECT branch_id, email, full_name, phone_number, user_id, user_name FROM User WHERE branch_id = ?`;
    db.query(sqlQuery, [req.user.branch_id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).send('Internal server error');
            return;
        }
        res.json(result);
    });
});

router.get('/api/manager_info', (req, res) => {
    const sqlQuery = `SELECT user_id, branch_id, email, full_name, phone_number, user_id, user_name FROM Manager WHERE user_id = ?`;
    db.query(sqlQuery, [req.user.user_id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).send('Internal server error');
            return;
        }
        res.json(result);
    });
});

router.post('/update-member/:id', (req, res) => {
    const { id } = req.params;
    const { user_name, email, phone_number, full_name, branch_id } = req.body;

    if (!user_name || !email || !phone_number || !full_name ) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
    }

    const sqlUpdate = `
        UPDATE User
        SET user_name = ?, email = ?, phone_number = ?, full_name = ?
        WHERE User_ID = ?;
    `;
    db.query(sqlUpdate, [user_name, email, phone_number, full_name, id], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Database error', error: err });
            return;
        }
        res.json({ message: 'Member updated successfully.' });
    });
});

// 删除成员
router.delete('/delete-member/:id', (req, res) => {
    const { id } = req.params;
    const sqlDelete = 'DELETE FROM User WHERE User_ID = ?';
    db.query(sqlDelete, [id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json({ message: 'Member deleted successfully.' });
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

router.get('/api/events', (req, res) => {
    const sqlQuery = `SELECT * FROM Activity WHERE branch_id = ?`;
    db.query(sqlQuery, [req.user.branch_id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).send('Internal server error');
            return;
        }
        res.json(result);
    });
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

router.get('/api/managers', (req, res) => {

    const sqlQuery = `
        SELECT user_id, user_name, branch_id
        FROM Manager WhERE branch_id = ?
    `;
    db.query(sqlQuery, [req.user.branch_id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ message: 'Error retrieving managers' });
            return;
        }
        res.json(result);  // 将查询结果以 JSON 格式发送
    });
});

router.post('/update-event/:id', (req, res) => {
    const { id } = req.params;
    const { activity_name, activity_date, activity_number_of_people, activity_information } = req.body;

    const sqlUpdate = `
        UPDATE Activity
        SET activity_name = ?, activity_date = ?, activity_number_of_people = ?, activity_information = ?, branch_id = ?
        WHERE activity_id = ?;
    `;
    db.query(sqlUpdate, [activity_name, activity_date, activity_number_of_people, activity_information, [req.user.branch_id], id], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Database error', error: err });
            return;
        }
        res.json({ message: 'Event updated successfully.' });
    });
});

// 删除活动
router.delete('/delete-event/:id', (req, res) => {
    const { id } = req.params;
    const sqlDelete = 'DELETE FROM Activity WHERE Activity_Id = ?';
    db.query(sqlDelete, [id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json({ message: 'Event deleted successfully.' });
    });
});




router.post('/add-event', (req, res) => {
    const { activity_name, activity_date, activity_number_of_people, activity_information } = req.body;
    const branch_id = req.user.branch_id;

    // 首先插入活动
    const sqlInsert = `
        INSERT INTO Activity (activity_name, activity_date, activity_number_of_people, activity_information, branch_id)
        VALUES (?, ?, ?, ?, ?);
    `;

    db.query(sqlInsert, [activity_name, activity_date, activity_number_of_people, activity_information, branch_id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ message: 'Error adding event' });
            return;
        }

        // 获取 branch_name
        const getBranchNameQuery = `SELECT branch_name FROM Branches WHERE branch_id = ?`;

        db.query(getBranchNameQuery, [branch_id], (err, branchResult) => {
            if (err) {
                console.error('Database error:', err);
                res.status(500).json({ message: 'Error fetching branch name' });
                return;
            }

            const branch_name = branchResult[0].branch_name;

            // 发送推文
            const textTweet = async () => {
                try {
                    const tweetContent = `New event created: ${activity_name} on ${activity_date} in ${branch_name}. Number of participants: ${activity_number_of_people}. Details: ${activity_information}`;
                    await rwClient.v2.tweet(tweetContent);
                } catch (error) {
                    console.error("Error sending tweet:", error);
                }
            };

            // 调用函数发送推文
            textTweet();

            // 获取该分支的所有用户邮箱并发送邮件通知
            const getEmailsQuery = `SELECT email FROM User WHERE branch_id = ?`;

            db.query(getEmailsQuery, [branch_id], (err, emailResult) => {
                if (err) {
                    console.error('Database error:', err);
                    res.status(500).json({ message: 'Error fetching user emails' });
                    return;
                }

                emailResult.forEach(user => {
                    const userEmail = user.email;
                    const subject = `New Event: ${activity_name}`;
                    const text = `A new event has been created in your branch (${branch_name}):\n\nEvent Name: ${activity_name}\nDate: ${activity_date}\nNumber of Participants: ${activity_number_of_people}\nDetails: ${activity_information}`;

                    // 发送邮件
                    sendEmail(userEmail, subject, text);
                });

                // 发送响应
                res.json({ message: 'Event added successfully and emails sent.', newEvent: req.body });
            });
        });
    });
});

router.get('/:section', function(req, res, next) {
    const section = req.params.section;
    let activitiesHtml;
    switch (section) {
        case 'security':
            // Return content for security settings
            res.send('Email Verified: Yes <br> <button @click="showChangePasswordModal = !showChangePasswordModal">Change Password</button>');
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
                            <td class="activity-participants">50 participants</td>
                            <td>Help clean up the Sydney beach area.</td>
                            <td><button class="activity-btn" style="background-color: green;">Join</button></td>
                        </tr>
                        <tr>
                            <td><img src="/images/melbourne.jpg" alt="Melbourne Activities" class="activity-image"></td>
                            <td>Melbourne Park Music Festival</td>
                            <td>2024-06-20</td>
                            <td class="activity-participants">200 participants</td>
                            <td>Enjoy live music in the park.</td>
                            <td><button class="activity-btn" style="background-color: green;">Join</button></td>
                        </tr>
                        <tr>
                            <td><img src="/images/adelaide.jpg" alt="Adelaide Activities" class="activity-image"></td>
                            <td>Adelaide Art Walk</td>
                            <td>2024-07-05</td>
                            <td class="activity-participants">80 participants</td>
                            <td>Explore street art around Adelaide.</td>
                            <td><button class="activity-btn" style="background-color: green;">Join</button></td>
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

router.post('/post-update', (req, res) => {
    const { title, content, visibility, selectedMembers } = req.body;
    const managerId = req.user.user_id;
    const branchId = req.user.branch_id;
    const postTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const sqlInsertUpdate = `
        INSERT INTO Updates (title, content, visibility, post_time, manager_id, branch_id)
        VALUES (?, ?, ?, ?, ?, ?);
    `;

    db.query(sqlInsertUpdate, [title, content, visibility, postTime, managerId, branchId], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ message: 'Error posting update' });
            return;
        }

        const updateId = result.insertId;

        if (visibility === 'private' && selectedMembers && selectedMembers.length > 0) {
            const sqlInsertUpdatesUsers = `
                INSERT INTO Updates_Users (update_id, user_id)
                VALUES ?
            `;
            const updatesUsersData = selectedMembers.map(userId => [updateId, userId]);

            db.query(sqlInsertUpdatesUsers, [updatesUsersData], (err, result) => {
                if (err) {
                    console.error('Database error:', err);
                    res.status(500).json({ message: 'Error posting update' });
                    return;
                }

                // 发送电子邮件通知
                selectedMembers.forEach(userId => {
                    const getUserEmailQuery = 'SELECT email FROM User WHERE user_id = ?';
                    db.query(getUserEmailQuery, [userId], (err, userResult) => {
                        if (err) {
                            console.error('Database error:', err);
                            return;
                        }

                        if (userResult.length > 0) {
                            const userEmail = userResult[0].email;
                            const subject = `New Private Update: ${title}`;
                            const text = `You have a new private update: ${content}`;
                            sendEmail(userEmail, subject, text);
                        }
                    });
                });

                res.json({ message: 'Update posted successfully.' });
            });
        } else {
            const viewName = visibility === 'public' ? 'PublicUpdates' : 'InsideBranchUpdates';
            const getBranchMembersQuery = `
                SELECT DISTINCT email FROM User
                JOIN ${viewName} ON User.branch_id = ${viewName}.branch_id
                WHERE User.branch_id = ?;
            `;

            db.query(getBranchMembersQuery, [branchId], (err, membersResult) => {
                if (err) {
                    console.error('Database error:', err);
                    res.status(500).json({ message: 'Error posting update' });
                    return;
                }

                // 去重处理
                const uniqueEmails = [...new Set(membersResult.map(member => member.email))];

                uniqueEmails.forEach(userEmail => {
                    const subject = `New ${visibility} Update: ${title}`;
                    const text = `You have a new ${visibility} update: ${content}`;
                    sendEmail(userEmail, subject, text);
                });

                res.json({ message: 'Update posted successfully.' });
            });
        }
    });
});


router.delete('/delete-update/:id', (req, res) => {
    const updateId = req.params.id;

    // 首先删除Updates_Users表中的关联记录
    const deleteFromUpdatesUsers = `
        DELETE FROM Updates_Users WHERE update_id = ?;
    `;

    db.query(deleteFromUpdatesUsers, [updateId], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ message: 'Error deleting update' });
            return;
        }

        // 然后删除Updates表中的记录
        const deleteFromUpdates = `
            DELETE FROM Updates WHERE update_id = ?;
        `;

        db.query(deleteFromUpdates, [updateId], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                res.status(500).json({ message: 'Error deleting update' });
                return;
            }

            res.json({ message: 'Update deleted successfully.' });
        });
    });
});


// 更新现有更新
router.put('/update-update/:id', (req, res) => {
    const updateId = req.params.id;
    const { title, content } = req.body;
    const editTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }

    const sqlUpdate = `
        UPDATE Updates
        SET title = ?, content = ?, post_time = ?
        WHERE update_id = ?;
    `;

    db.query(sqlUpdate, [title, content, editTime, updateId], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error updating update' });
        }

        const getUpdateDetailsQuery = `
            SELECT visibility, branch_id FROM Updates WHERE update_id = ?;
        `;
        db.query(getUpdateDetailsQuery, [updateId], (err, updateResult) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Error updating update' });
            }

            if (updateResult.length > 0) {
                const { visibility, branch_id } = updateResult[0];

                if (visibility === 'private') {
                    const getSelectedMembersQuery = `
                        SELECT user_id FROM Updates_Users WHERE update_id = ?;
                    `;
                    db.query(getSelectedMembersQuery, [updateId], (err, selectedMembersResult) => {
                        if (err) {
                            console.error('Database error:', err);
                            return res.status(500).json({ message: 'Error updating update' });
                        }

                        selectedMembersResult.forEach(member => {
                            const userId = member.user_id;
                            const getUserEmailQuery = 'SELECT email FROM User WHERE user_id = ?';
                            db.query(getUserEmailQuery, [userId], (err, userResult) => {
                                if (err) {
                                    console.error('Database error:', err);
                                    return;
                                }

                                if (userResult.length > 0) {
                                    const userEmail = userResult[0].email;
                                    const subject = `Updated Private Update: ${title}`;
                                    const text = `A private update has been updated: ${content}`;
                                    sendEmail(userEmail, subject, text);
                                }
                            });
                        });
                    });
                } else {
                    const viewName = visibility === 'public' ? 'PublicUpdates' : 'InsideBranchUpdates';
                    const getBranchMembersQuery = `
                        SELECT email FROM User
                        JOIN ${viewName} ON User.branch_id = ${viewName}.branch_id
                        WHERE User.branch_id = ?;
                    `;

                    db.query(getBranchMembersQuery, [branch_id], (err, membersResult) => {
                        if (err) {
                            console.error('Database error:', err);
                            return res.status(500).json({ message: 'Error updating update' });
                        }

                        membersResult.forEach(member => {
                            const userEmail = member.email;
                            const subject = `Updated ${visibility} Update: ${title}`;
                            const text = `An ${visibility} update has been updated: ${content}`;
                            sendEmail(userEmail, subject, text);
                        });
                    });
                }
            }
        });

        res.json({ message: 'Update edited successfully.' });
    });
});

router.get('/api/user/:user_id', (req, res) => {
    const userId = req.params.user_id;
    console.log(`Token for user ${userId}:`, req.headers['authorization']);
    const sql = `
        SELECT u.user_name, u.email, u.full_name, u.phone_number, b.branch_name AS organization
        FROM Manager u
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
})

router.put('/api/user/:user_id', (req, res) => {
    const userId = req.params.user_id;
    const { user_name, email, full_name, phone_number } = req.body;
    console.log('UserId:', userId);
    console.log('user_name:', user_name);
    console.log('phone_number:', phone_number);
    const sql = `
        UPDATE Manager
        SET user_name = ?, email = ?, full_name = ?, phone_number = ?
        WHERE user_id = ?
    `;
    db.query(sql, [user_name, email, full_name, phone_number, userId], (err, result) => {
        console.log('Manager id:', userId);
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
        FROM Manager
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
            UPDATE Manager
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


router.get('/api/activities/:activityId/participants', (req, res) => {
    const { activityId } = req.params;
    const sqlQuery = `SELECT * FROM User_in_activities WHERE activity_id = ?`;

    db.query(sqlQuery, [activityId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).send('Internal server error');
            return;
        }
        res.json(results);
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

router.get('/api/branch/:branchId/user-count', (req, res) => {
    const branchId = req.user.branch_id;
    const query = 'SELECT COUNT(*) AS count FROM User WHERE branch_id = ?';
    db.query(query, [branchId], (error, results) => {
        if (error) {
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json({ totalUsers: results[0].count });
    });
});

router.get('/api/rsvp/users', (req, res) => {
    const branchID = req.user.branch_id;
    console.log('Getting users in activities');
    console.log('branch id', branchID);
    const query = `
            SELECT
                uia.user_id,
                u.user_name,
                u.branch_id,
                act.activity_name,
                uia.remarks,
                uia.reply_date
            FROM
                User_in_activities uia
            JOIN
                User u ON uia.user_id = u.user_id
            JOIN
                Activity act ON uia.activity_id = act.activity_id
            WHERE
                u.branch_id = ?;
        `;
    db.query(query, [branchID], (error, results) => {
        if (error) {
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
});

module.exports = router;