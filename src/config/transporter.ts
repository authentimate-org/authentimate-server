import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.Authentimate_Official_Email,
      pass: process.env.Email_Password
    }
});

export default transporter;