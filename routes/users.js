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

const SECRET_KEY_MANAGER = 'manager_secret_key';
const SECRET_KEY_ADMIN = 'admin_secret_key';
const SECRET_KEY_User = 'user_secret_key';



router.use(express.static(path.join(__dirname, '../public')));

router.get('/profile', function(req, res) {
    res.sendFile(path.join(__dirname, '../public', '/Profile.html'));
});


const generateHash = (password, salt = '10') => {
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash ;
};


router.post('/user_login', function(req, res) {
    const { email, password } = req.body;
    const hashedPassword = generateHash(password);
    const sqlQuery = 'SELECT user_id, branch_id FROM User WHERE email = ? AND password = ?';
    db.query(sqlQuery, [email, hashedPassword], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
        if (results.length > 0) {
            const user = results[0];
            const token = jwt.sign({
                user_id: user.user_id,
                email: email,
                branch_id: user.branch_id
            }, SECRET_KEY_User, { expiresIn: '1h' });
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 3600000
            });
            console.log("Sending token:", token);
            res.json({ token: token, message: 'Login successful' });
            return;
        } else {

            res.status(401).send('Email or password is incorrect');
            return;
        }
    });
});






router.post('/user_register', function(req, res) {
    const { user_name, password, email } = req.body;
    const hashedPassword = generateHash(password);
    const sql = 'INSERT INTO User (user_name, password, email) VALUES (?, ?, ?)';
    db.execute(sql, [user_name, hashedPassword, email], (error, results) => {
        if (error) {
            res.send('Error during registration: ' + error.message);
            return;
        }

        const sqlQuery = 'SELECT user_id, branch_id FROM User WHERE email = ? AND password = ?';
        db.query(sqlQuery, [email, hashedPassword], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                res.status(500).json({ message: 'Internal server error' });
                return;
            }
            if (results.length > 0) {
                const user = results[0];
                const token = jwt.sign({
                    user_id: user.user_id,
                    email: email,
                    branch_id: user.branch_id
                }, SECRET_KEY_User, { expiresIn: '1h' });
                res.cookie('jwt', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 3600000
                });
                console.log("Sending token:", token);
                res.json({ token: token, message: 'Login successful' });
                return;
            } else {

                res.status(401).send('Email or password is incorrect');
                return;
            }
        });
        //  res.sendFile(path.join(__dirname, '../public', '/AddDetail.html'));
    });
});



router.post('/add_detail', function(req, res) {
    const { Phonenumber, fullname, organization } = req.body;
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY_User);
        const userId = decoded.user_id;


        const branchSql = 'SELECT branch_id FROM Branches WHERE branch_name = ?';
        db.query(branchSql, [organization], (branchError, branchResults) => {
            if (branchError) {
                return res.status(500).json({ message: 'Error fetching branch details: ' + branchError.message });
            }

            if (branchResults.length === 0) {
                return res.status(404).json({ message: 'Organization not found.' });
            }

            const branchId = branchResults[0].branch_id;


            const userSql = 'UPDATE User SET phone_number = ?, full_name = ?, branch_id = ? WHERE user_id = ?';
            db.execute(userSql, [Phonenumber, fullname, branchId, userId], (userError, userResults) => {
                if (userError) {
                    return res.status(500).json({ message: 'Error updating user details: ' + userError.message });
                }

                const newToken = jwt.sign({
                    user_id: userId,
                    email: decoded.email,
                    branch_id: branchId
                }, SECRET_KEY_User, { expiresIn: '1h' });


                res.cookie('jwt', newToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 3600000
                });
                res.json({ success: true, message: 'Details updated successfully' });
            });
        });
    } catch (error) {
        return res.status(401).json({ message: 'Failed to authenticate token.' });
    }
});


router.get('/branches', function(req, res) {
    const sqlQuery = 'SELECT branch_name FROM Branches';
    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
        res.json(results);
    });
});




router.post('/manager_login', function(req, res) {
    const { email, password } = req.body;
    const hashedPassword = generateHash(password);
    const sqlQuery = 'SELECT user_id, branch_id FROM Manager WHERE email = ? AND password = ?';
    db.query(sqlQuery, [email, hashedPassword], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
        if (results.length > 0) {
            const user = results[0];
            const token = jwt.sign({
                user_id: user.user_id,
                email: email,
                branch_id: user.branch_id
            }, SECRET_KEY_MANAGER, { expiresIn: '1h' });
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 3600000
            });
            console.log("Sending token:", token);
            res.json({ token: token, message: 'Login successful' });
            return;
        } else {

            res.status(401).send('Email or password is incorrect');
            return;
        }
    });
});





router.post('/manager_register', function(req, res) {
    const { user_name, password, email } = req.body;
    const hashedPassword = generateHash(password);
    const sql = 'INSERT INTO Manager (user_name, password, email) VALUES (?, ?, ?)';
    db.execute(sql, [user_name, hashedPassword, email], (error, results) => {
          if (error) {
              res.send('Error during registration: ' + error.message);
              return;
          }

          res.sendFile(path.join(__dirname, '../public', '/AddDetail.html'));
      });
  });





router.post('/admin_login', function(req, res) {
    const { email, password } = req.body;
    const hashedPassword = generateHash(password);
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
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 3600000
            });
            console.log("Sending token:", token);
            res.json({ token: token, message: 'Login successful' });
            return;
        } else {

            res.status(401).send('Email or password is incorrect');
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

router.get('/api/updates', (req, res) => {
    const userId = req.user.user_id;
    const branchId = req.user.branch_id;

    const sqlQuery = `
        SELECT *
        FROM (
            SELECT * FROM PublicUpdates
            UNION
            SELECT * FROM InsideBranchUpdates WHERE branch_id = ?
            UNION
            SELECT * FROM PrivateUpdates WHERE update_id IN (
                SELECT update_id FROM Updates_Users WHERE user_id = ?
            )
        ) AS combinedUpdates
        ORDER BY post_time DESC;
    `;

    db.query(sqlQuery, [branchId, userId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ message: 'Error fetching updates' });
            return;
        }
        res.json(results);
    });
});

module.exports = router;