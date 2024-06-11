// authMiddleware.js
var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
router.use(cookieParser());

const SECRET_KEY_User = 'user_secret_key';
const SECRET_KEY_MANAGER = 'manager_secret_key';
const SECRET_KEY_ADMIN = 'admin_secret_key';

const authenticateToken = (secretKey) => {
    return (req, res, next) => {
        // console.log("Cookies available:", req.cookies);
        if (!req.cookies || !req.cookies.jwt) {
            // return res.status(401).json({ message: "Token not provided" });
            return res.redirect('/login-failed.html');
        }
        const token = req.cookies.jwt;

        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                // const statusCode = err.name === 'TokenExpiredError' ? 401 : 403;
                // return res.status(statusCode).json({ message: "Invalid or expired token" });
                return res.redirect('/login-failed.html');
            }
            req.user = decoded;
            next();
        });
    };
};

const authenticateUserToken = authenticateToken(SECRET_KEY_User);
const authenticateManagerToken = authenticateToken(SECRET_KEY_MANAGER);
const authenticateAdminToken = authenticateToken(SECRET_KEY_ADMIN);

module.exports = { authenticateUserToken, authenticateManagerToken, authenticateAdminToken };
