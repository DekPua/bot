const nodemailer = require('nodemailer');

module.exports = (client) => {
    client.sendEmail = (emailTo, subject, text, html) => {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          secure: true,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });
      
        const mailOptions = {
          from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER}>`,
          to: emailTo,
          subject: subject,
          text: text,
          html: html,
        };
      
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return {
              status: 1,
              detail: error,
            };
          } else {
            return {
              status: 0,
              detail: info.response,
            };
          }
        });
      }
}