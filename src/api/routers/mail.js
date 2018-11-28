const express = require('express');
var nodeMailer = require('nodemailer');

const mailRouter = express.Router();

var transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'plataforma.armazem@gmail.com',
    pass: 'armazemplataforma1'
  },
  tls: { rejectUnauthorized: false }
});

mailRouter.get('/send_mail/:mail', async (req, res) => {
  try {
    var mailOptions = {
      from: 'plataforma.armazem@gmail.com',
      to: req.params.mail,
      subject: 'New Request Available',
      text:
        'Hello! A new request is now available at requests page! Please check the following link: http://armazemdeec.fe.up.pt:49160/requests',
      html:
        'Hello!<br><br>' +
        'A new request is now available at requests page! Please check the following link: http://armazemdeec.fe.up.pt:49160/requests'
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    res.send('Successfully sent email');
  } catch (e) {
    res.send('Failed to send email!');
  }
});

export default mailRouter;
