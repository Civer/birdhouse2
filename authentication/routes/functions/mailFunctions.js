var nodemailer = require("nodemailer");
const Email = require("email-templates");

var initMailTransporter = function() {
  var transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD
    }
  });
  return transporter;
};

var sendRegistrationMail = function(emailAddress, userid, token) {
  return new Promise((resolve, reject) => {
    console.log(process.env.NODE_ENV);
    var url = process.env.AUTH_SERVER_URL + "verify/" + userid + "_" + token;

    var transport = initMailTransporter();

    const email = new Email({
      message: {
        from: "apps@rpggamer.de"
      },
      // uncomment below to send emails in development/test env:
      send: true,
      transport,
      views: {
        options: {
          extension: "ejs" // <---- HERE
        }
      }
    });

    email
      .send({
        template: "registrationSuccesful",
        message: {
          to: emailAddress
        },
        locals: {
          link: url
        }
      })
      .then(info => resolve(info))
      .catch(error => reject(error));
  });
};

var emailFunctions = {
  sendRegistrationMail
};

module.exports = emailFunctions;
