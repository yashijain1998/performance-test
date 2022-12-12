var nodemailer = require('nodemailer');

var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'jainnyashi@gmail.com',
        pass: 'muwnqszkipvqdkzi'
    }
  };
  var transporter = nodemailer.createTransport(smtpConfig);


const sendEmail = async(mailOptions) => {
    await transporter.sendMail(mailOptions);
}


module.exports = {sendEmail};