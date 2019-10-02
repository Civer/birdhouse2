var nodemailer = require("nodemailer");

var initMailTransporter = function() {
  var transporter = nodemailer.createTransport({
    host: process.env.BACKEND_SMTP_HOST,
    port: process.env.BACKEND_SMTP_PORT,
    auth: {
      user: process.env.BACKEND_SMTP_USERNAME,
      pass: process.env.BACKEND_SMTP_PASSWORD
    }
  });
  return transporter;
};

var sendRegistrationMail = function(email, userid, token) {
  return new Promise((resolve, reject) => {
    var url = process.env.BACKEND_AUTH_URL + "/verify/" + userid + "_" + token;

    var transporter = initMailTransporter();

    var mailOptions = {
      from: "apps@rpggamer.de",
      to: email,
      subject: "Sending Email using Node.js",
      text: "Your token:" + url
    };

    transporter
      .sendMail(mailOptions)
      .then(info => {
        console.log("Email sent: " + info.response);
        resolve(info);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });
};

var emailFunctions = {
  sendRegistrationMail
};

module.exports = emailFunctions;
