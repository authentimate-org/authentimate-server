import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.CERTIFICATION_SENDING_MAIL,
      pass: process.env.CERTIFICATION_SENDING_MAIL_PASSWORD
    }
});

export { nodemailer };

export default transporter;