/**
 * Handles the creation and sending of all emails
 */
var env = process.env.NODE_ENV || 'development';
var config = require('./config')[env]['smtp'];
var nodemailer = require('nodemailer');
var transporter = config ? nodemailer.createTransport(config) : null;

var Emails = {
  sendPasswordReset: function (email, password, callback) {
    if (!transporter) {
      return;
    }
    var template = this._build_PasswordReset(email, password);
    var mailData = {
      from: config.auth.user,
      to: email,
      subject: 'FFXIV Marketing - Password Reset',
      text: template.text,
      html: template.html
    };
    transporter.sendMail(mailData, function (err, info) {
      if (!err) {
        console.log('Password Reset Sent to:', email);
        callback.call(null, true);
      } else {
        console.log('Password Reset Error:', err);
        callback.call(null, false);
      }
    });
  },
  _build_PasswordReset: function (email, password) {
    var html = '';
    html += '<h3>Dear '+email+',</h3>';
    html += '<p>A password reset has been requested for you from <a href="https://ffxiv-marketing.herokuapp.com">https://ffxiv-marketing.herokuapp.com</a></p>';
    html += '<p>You have been given a temporary password of <b>'+password+'</b> which should only be used temporarily. After signing in with the new password, it is recommended to change to a new password from the My Profile page on the site.</p>';
    html += '<p>Thank you,<br/>The FFXIV Marketing Dev Team</p>';
    var text = 'Dear '+email+',\n\nA password A password reset has been requested for you from https://ffxiv-marketing.herokuapp.com\n\n';
    text += 'You have been given a temporary password of '+password+' which should only be used temporarily. After signing in with the new password, it is recommended to change to a new password from the My Profile page on the site.\n\n';
    text += 'Thank you,\n\nThe FFXIV Marketing Dev Team';
    return {html: html, text: text};
  }
};

module.exports = Emails;