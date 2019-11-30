/**
 * mail util module
 * @module util/mail
 */

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

/**
 * sends a mail
 * @param {string} dst - the receving email
 * @param {string} subject - the subject of the mail
 * @param {string} message - the message to send
 * @returns {Promise<Object>} an object represeting the result of this operation
 */
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
