const nodemailer = require('nodemailer');

const mailAccount = 'projet.cdp.m2.2019@gmail.com';
const password = 'CdPM22019';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: mailAccount,
    pass: password
  }
});

module.exports.sendMail = (dst, subject, message) => new Promise((resolve, reject) => {
  const mailOptions = {
    from: mailAccount,
    to: dst,
    subject: subject,
    html: message
  };

  transporter
    .sendMail(mailOptions)
    .then(info => resolve(info))
    .catch(err => reject(err));
});