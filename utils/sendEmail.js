const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async ({ from, to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.FROM_EMAIL_ADDRESS,
      pass: process.env.PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    // from: `<${process.env.FROM}> <${process.env.FROM_EMAIL_ADDRESS}>`,
    from,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
