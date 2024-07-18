import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.AUTHENTIMATE_OFFICIAL_EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
});

export { nodemailer };

export default transporter;