var express = require('express');
var router = express.Router();
var path = require('path');
const db = require('../db');


router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../public', '/manager.html'));
});

router.get('/manager', function(req, res) {
    res.sendFile(path.join(__dirname, '../public', '/manager.html'));
});


router.get('/branch', function(req, res) {
    res.sendFile(path.join(__dirname, '../public', '/branch.html'));
});

router.get('/organization', function(req, res) {
    res.sendFile(path.join(__dirname, '../public', '/organization.html'));
});

router.get('/admins_management', function(req, res) {
    res.sendFile(path.join(__dirname, '../public', '/admins_management.html'));
});

router.get('/admin.css', function(req, res) {
    res.sendFile(path.join(__dirname, '../public', '/admin.css'));
});

//all-users
router.get('/api/members', (req, res) => {
    const sqlQuery = `SELECT * FROM User`;
    db.query(sqlQuery, (err, result) => {
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

    if (!user_name || !email || !phone_number || !full_name || (branch_id === undefined || branch_id === null || branch_id === '')) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
    }

    if (!user_name || !email || !phone_number || !full_name ) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
    }

    const sqlUpdate = `
        UPDATE User
        SET user_name = ?, email = ?, phone_number = ?, full_name = ?, branch_id = ?
        WHERE User_ID = ?;
    `;
    db.query(sqlUpdate, [user_name, email, phone_number, full_name, branch_id, id], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Database error', error: err });
            return;
        }
        res.json({ message: 'Member updated successfully.' });
    });
});


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


router.post('/add-member', (req, res) => {
    const { user_name, password, email, phone_number, full_name, branch_id } = req.body;
    const sqlInsert = `
        INSERT INTO User (user_name, password, email, phone_number, full_name, branch_id)
        VALUES (?, ?, ?, ?, ?, ?);
    `;
    db.query(sqlInsert, [user_name, password, email, phone_number, full_name, branch_id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ message: 'Error adding member' });
            return;
        }
        res.json({ message: 'Member added successfully.', newMember: req.body });
    });
});



router.get('/api/administrators',  (req, res) => {
    const sqlQuery = 'SELECT * FROM Administrator';
    db.query(sqlQuery, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

router.post('/update-administrator/:id', (req, res) => {
    const { id } = req.params;
    const { User_Name, Email} = req.body;

    const sqlUpdate = `
        UPDATE Administrator
        SET User_Name = ?, Email = ?
        WHERE User_ID = ?;
    `;
    db.query(sqlUpdate, [User_Name, Email, id], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Database error', error: err });
            return;
        }
        res.json({ message: 'Administrator updated successfully.' });
    });
});


router.delete('/delete-administrator/:id', (req, res) => {
    const { id } = req.params;
    const sqlDelete = 'DELETE FROM Administrator WHERE User_ID = ?';
    db.query(sqlDelete, [id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json({ message: 'Administrator deleted successfully.' });
    });
});


router.post('/add-administrator', (req, res) => {
    const { User_Name, Password, Email} = req.body;

    const sqlInsert = `
        INSERT INTO Administrator (User_Name, Password, Email)
        VALUES (?, ?, ?);
    `;
    db.query(sqlInsert, [User_Name, Password, Email], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ message: 'Error adding administrator' });
            return;
        }
        res.json({ message: 'Administrator added successfully.', newAdministrator: req.body });
    });
});

//branch

router.get('/api/branches', (req, res) => {
    const sqlQuery = 'SELECT * FROM Branches';
    db.query(sqlQuery, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

router.post('/update-branch/:id', (req, res) => {
    const { id } = req.params;
    const { branch_name, description, image_url } = req.body;

    const sqlUpdate = `
        UPDATE Branches
        SET branch_name = ?, description = ?, image_url = ?
        WHERE branch_id = ?;
    `;
    db.query(sqlUpdate, [branch_name, description, image_url, id], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Database error', error: err });
            return;
        }
        res.json({ message: 'Branch updated successfully.' });
    });
});


router.delete('/delete-branch/:id', (req, res) => {
    const { id } = req.params;
    const sqlDelete = 'DELETE FROM Branches WHERE branch_id = ?';
    db.query(sqlDelete, [id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json({ message: 'Branch deleted successfully.' });
    });
});

router.post('/add-branch', (req, res) => {
    const { branch_name, description, image_url } = req.body;
    const sqlInsert = `
        INSERT INTO Branches (branch_name, description, image_url)
        VALUES (?, ?, ?);
    `;
    db.query(sqlInsert, [branch_name, description, image_url], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ message: 'Error adding branch' });
            return;
        }
        res.json({ message: 'Branch added successfully.', newBranch: req.body });
    });
});


router.get('/api/managers', (req, res) => {
    const sqlQuery = 'SELECT * FROM Manager';
    db.query(sqlQuery, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

router.post('/update-manager/:id', (req, res) => {
    const { id } = req.params;
    const { user_name, email, phone_number, full_name, branch_id } = req.body;



    const sqlUpdate = `
        UPDATE User
        SET user_name = ?, email = ?, phone_number = ?, full_name = ?, branch_id = ?
        WHERE User_ID = ?;
    `;
    db.query(sqlUpdate, [user_name, email, phone_number, full_name, branch_id, id], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Database error', error: err });
            return;
        }
        res.json({ message: 'Manager updated successfully.' });
    });
});


router.delete('/delete-manager/:id', (req, res) => {
    const { id } = req.params;
    const sqlDelete = 'DELETE FROM Manager WHERE user_id = ?';
    db.query(sqlDelete, [id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json({ message: 'Manager deleted successfully.' });
    });
});


router.post('/add-manager', (req, res) => {
    const { user_name, password, email, phone_number, full_name, branch_id } = req.body;

    const sqlInsert = `
        INSERT INTO Manager (user_name, password, email, phone_number, full_name, branch_id)
        VALUES (?, ?, ?, ?, ?, ?);
    `;
    db.query(sqlInsert, [user_name, password, email, phone_number, full_name, branch_id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ message: 'Error adding manager' });
            return;
        }
        res.json({ message: 'Manager added successfully.', newManager: req.body });
    });
});

router.get('/logout', (req, res) => {

    res.cookie('jwt', '', {
        expires: new Date(0),
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: 'strict'
    });
    console.log("Cookies should not be available:", req.cookies);
    res.status(200).send("Logged out");
});

module.exports = router;