import transporter, { nodemailer } from '../config/transporter';

const mailer = async function (recipientEmail: string, recipientName: string, issuerName: string | undefined, certificationId: string, certificationUrl: string) {
  const subject = 'Your Certificate of Achievement';
  const text = certificationId;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="text-align: center; color: #333;">Congratulations, ${recipientName}!</h2>
      <p style="text-align: center; color: #333;">
        We are pleased to inform you that you have been awarded a certificate by '${issuerName}'.
      </p>
      <p style="text-align: center; color: #333;">
        Please find your certificate by clicking on the link below:
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${certificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          View Your Certificate
        </a>
      </div>
      <p style="text-align: center; color: #333;">
        Thank you for your hard work and dedication.
      </p>
      <p style="text-align: center; color: #333;">
        Sincerely,
        <br />
        The Authentimate Team
      </p>
    </div>
  `;

  const mailOptions = {
    from: process.env.AUTHENTIMATE_OFFICIAL_EMAIL,
    to: recipientEmail,
    subject,
    text,
    html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('---------Email sent---------');
    console.log(`Message ID: ${info.messageId}`);
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    console.log('Response:', info.response);
    return { success: true, info };
  } catch (error: any) {
    console.log('---------Error in sendCertificationToRecipientEmail----------');
    console.log(`Error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

export default mailer;
