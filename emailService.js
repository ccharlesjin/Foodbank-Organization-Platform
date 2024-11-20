const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    'actual-client-id',
    'actual-client-secret',
    'https://developers.google.com/oauthplayground'
);


oauth2Client.setCredentials({
    refresh_token: 'actual-refresh-token'
});


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
                clientId: 'actual-client-id',
                clientSecret: 'actual-client-secret',
                refreshToken: 'actual-refresh-token',
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


