const nodemailer = require('nodemailer');

const getSmtpConfig = () => {
  const port = Number(process.env.ZOHO_SMTP_PORT || 465);

  return {
    host: process.env.ZOHO_SMTP_HOST || 'smtp.zoho.com',
    port,
    secure: port === 465,
    auth: {
      user: process.env.ZOHO_SMTP_USER,
      pass: process.env.ZOHO_SMTP_PASS
    }
  };
};

const getTransporter = () => {
  const config = getSmtpConfig();

  if (!config.auth.user || !config.auth.pass) {
    throw new Error('Missing ZOHO_SMTP_USER or ZOHO_SMTP_PASS');
  }

  return nodemailer.createTransport(config);
};

export const sendInvoiceEmail = async (to, subject, htmlContent) => {
  try {
    const fromEmail = process.env.FROM_EMAIL || process.env.ZOHO_SMTP_USER || 'sales@luchem.co.za';
    const transporter = getTransporter();

    const response = await transporter.sendMail({
      to,
      from: `"LuChem Cleaning Solutions" <${fromEmail}>`,
      subject,
      html: htmlContent,
      replyTo: process.env.REPLY_TO_EMAIL || 'sales@luchem.co.za'
    });

    console.log('Zoho email sent successfully to:', to);
    return { success: true, messageId: response.messageId };
  } catch (error) {
    console.error('Zoho SMTP error:', error);
    return { success: false, error: error.message };
  }
};
