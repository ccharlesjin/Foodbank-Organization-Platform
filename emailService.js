const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

// 创建OAuth2客户端
const oauth2Client = new OAuth2(
    '920888800688-ghvj9cmddhcaub9jl1ajbjpbvk64kiod.apps.googleusercontent.com',
    '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',
    'https://developers.google.com/oauthplayground' // 重定向URL
);

// 设置OAuth2客户端凭据
oauth2Client.setCredentials({
    refresh_token: '1//04-YNm0euEly9CgYIARAAGAQSNgF-L9IrFjpKI6C1xKZsMFJdQ6F9HbPhaORSXTjzKtAXZKznb1k5tdw1VHOCw6e4lEPuwOF9Yg'
});

// 获取访问令牌并发送邮件
function sendEmail(to, subject, text) {
    oauth2Client.getAccessToken((err, token) => {
        if (err) {
            console.error('Failed to create access token:', err);
            return;
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'foodbank.organization@gmail.com',
                clientId: '920888800688-ghvj9cmddhcaub9jl1ajbjpbvk64kiod.apps.googleusercontent.com',
                clientSecret: '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',
                refreshToken: '1//04-YNm0euEly9CgYIARAAGAQSNgF-L9IrFjpKI6C1xKZsMFJdQ6F9HbPhaORSXTjzKtAXZKznb1k5tdw1VHOCw6e4lEPuwOF9Yg',
                accessToken: token,
            },
        });

        const mailOptions = {
            from: 'foodbank.organization@gmail.com',
            to,
            subject,
            text,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });
    });
}

module.exports = { sendEmail };


