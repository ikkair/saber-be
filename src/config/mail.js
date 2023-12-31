const nodemailer = require("nodemailer");
require("dotenv").config();
const HOST = process.env.EMAIL_HOST

// Config
const configMail = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_SENDER, // generated ethereal user
        pass: process.env.EMAIL_SENDER_PASSWORD, // generated ethereal password
    },
});

function sendCurrentPasswordMail(pwd, email) {
    // Content
    configMail.sendMail({
        from: process.env.EMAIL_SENDER, // sender address
        to: email, // list of receivers
        subject: "Saber Reset Password", // Subject line
        html: `<p>Password telah diganti menjadi ${pwd}</p>`, // html body
    });
    return;
}

function sendConfirmationMail(token, email) {
    // Content
    configMail.sendMail({
        from: process.env.EMAIL_SENDER, // sender address
        to: email, // list of receivers
        subject: "Saber Confirmation Forgot Password", // Subject line
        html: `<a href="${HOST}/users/auth/forgot-verification?token=${token}">Klik untuk ubah password<a>`, // html body
    });
    return;
}


function sendActivationMail(token, email) {
    // Content
    configMail.sendMail({
        from: process.env.EMAIL_SENDER, // sender address
        to: email, // list of receivers
        subject: "Saber Activation Link", // Subject line
        html: `<a href="${HOST}/users/auth/verification?token=${token}">Aktifkan akun<a>`, // html body
    });
    return;
}

module.exports = {
    sendActivationMail,
    sendConfirmationMail,
    sendCurrentPasswordMail
};
