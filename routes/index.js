var express = require('express');
var router = express.Router();
var path = require('path');
const mysql = require('mysql2');
const db = require('../db');

var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;

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




//第三方登录
passport.use(new GitHubStrategy({
    clientID: "Iv23li6OLrzh1xVrbyGt",
    clientSecret: "d0eb868362e55e35d93107b6498da7ed34e87d53",
    callbackURL: "http://localhost:3018/githubsignin/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      return done(null, profile);
    });
  }
  ));


  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });


  router.get('/githubsignin', passport.initialize(), passport.authenticate('github', { scope: [ 'user:email' ], session: false }), function(req, res){ /* Leave empty */ });

  router.get('/githubsignin/callback', passport.initialize(), passport.authenticate('github', { failureRedirect: '/loginfailed.html', session: false }), function(req, res, next) {


    const userEmail = req.user.emails[0].value;
    const sql = 'SELECT * FROM User WHERE email = ?';
    console.log(userEmail);
    db.execute(sql, [userEmail], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            res.redirect('/loginfailed.html');
            return;
        }
        if (results.length > 0) {
            // If email exists in the User table, login successful
            res.send('<script>window.opener.location.href = "/Profile.html"; window.close();</script>');
        } else {
            // If email does not exist
            res.send('<script>alert("未查询到用户，请注册"); window.opener.location.href = "/register.html"; window.close();</script>');
        }
    });


  });














module.exports = router;