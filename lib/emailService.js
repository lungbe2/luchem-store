const sgMail = require('@sendgrid/mail');

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendInvoiceEmail = async (to, subject, htmlContent) => {
  try {
    const fromEmail = process.env.FROM_EMAIL || 'sales@luchem.co.za';
    
    const msg = {
      to: to,
      from: fromEmail,
      fromName: 'LuChem Cleaning Solutions',
      subject: subject,
      html: htmlContent,
      replyTo: 'sales@luchem.co.za'
    };

    const response = await sgMail.send(msg);
    console.log('Email sent successfully to:', to);
    return { success: true, messageId: response[0].headers['x-message-id'] };
  } catch (error) {
    console.error('SendGrid error:', error);
    
    if (error.response) {
      console.error('Error body:', error.response.body);
    }
    
    return { success: false, error: error.message };
  }
};
