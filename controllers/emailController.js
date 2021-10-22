const nodemailer = require("nodemailer");
let jwt = require('jsonwebtoken');
User = require('../models/userModel');
const config = require("../config/auth.config");

sendPasswordResetEmail = async (req, res) =>{
    
    let emailAddress = req.body.email;

    User.findOne({ EmailAddress : emailAddress })
    .exec(async(err, user) => {
        if (err) {
            return res.status(500).send({ message: err });
        }

        if (!user) {
            return res.status(404).send({ message: "Email Address Not Found." });
        }

        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 1800 //30 mins in seconds
        });

        let testAccount = await nodemailer.createTestAccount();
        let transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: testAccount.user, 
            pass: testAccount.pass,
          },
        });
      
        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: '"My Admin" <admin@my.com>',
          to: emailAddress, 
          subject: "We have received your request...", 
          html: "<b>Password Reset</b><p>We have received your request for a password reset. " +
          "Please click on this link to be redirected to do your password reset:" +
           `<a href='http://localhost:4200/welcome/set-password/${token}'>Reset Password</a></p>`,
        }).catch((err) =>{
            return res.status(500).send({ message: "Unable to send email. Server error."});
        });
      
        console.log("Message sent: %s", info.messageId);
            
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));   
        return res.status(200).send({ message: `Reset Email Sent. Reference: ${info.messageId}`});
    })
}

emailObjs = {
    sendPasswordResetEmail
};

module.exports = emailObjs;