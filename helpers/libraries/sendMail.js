const nodemailer = require('nodemailer');

const sendEmail = async (mailOptions) => {
    let tranporter = nodemailer.createTransport({
        host : process.env.SMTP_HOST,
        port : process.env.SMTP_PORT,
        auth : {
            user: "emrahumutkoc@gmail.com",
            pass: ""
        }
    });
    let info = await tranporter.sendMail(mailOptions);
    console.log(`message sent: ${info.messageId}`);
};

module.exports = sendEmail;