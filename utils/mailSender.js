require("dotenv").config();
const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: `Study Notion Online`,
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });
    
    return info;
  } catch (error) {
    return error;
  }
};

// export
module.exports = mailSender;