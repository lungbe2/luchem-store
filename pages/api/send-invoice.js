import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, orderId, customerName, customerEmail, orderDate, items, subtotal, deliveryFee, total, shippingAddress } = req.body;

  // Format items for email
  const itemsList = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} (${item.size})</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">R${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  const formatZAR = (amount) => `R${amount.toFixed(2)}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>LuChem Invoice #${orderId}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 30px 20px;
          text-align: center;
          border-radius: 12px 12px 0 0;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .header p {
          margin: 5px 0 0;
          opacity: 0.9;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 12px 12px;
        }
        .order-details {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .order-details h3 {
          margin-top: 0;
          color: #667eea;
        }
        .company-info {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          text-align: center;
          font-size: 14px;
          border: 1px solid #e0e0e0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th {
          background: #667eea;
          color: white;
          padding: 12px;
          text-align: left;
        }
        td {
          padding: 10px;
        }
        .total-row {
          font-weight: bold;
          font-size: 18px;
          border-top: 2px solid #ddd;
        }
        .bank-details {
          background: #f0f7ff;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #667eea;
        }
        .bank-details pre {
          background: white;
          padding: 15px;
          border-radius: 6px;
          overflow-x: auto;
          font-family: monospace;
          margin: 10px 0;
        }
        .important-notes {
          background: #fff3e0;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #ed8936;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #999;
          border-top: 1px solid #ddd;
          margin-top: 20px;
        }
        .status-pending {
          display: inline-block;
          padding: 4px 12px;
          background: #ed8936;
          color: white;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🧼 LuChem Cleaning Solutions</h1>
          <p>Tax Invoice</p>
        </div>
        
        <div class="content">
          <p>Dear <strong>${customerName}</strong>,</p>
          <p>Thank you for your order! Please find your tax invoice below.</p>
          
          <div class="order-details">
            <h3>Order Information</h3>
            <p><strong>Invoice Number:</strong> #${orderId}</p>
            <p><strong>Invoice Date:</strong> ${orderDate}</p>
            <p><strong>Payment Status:</strong> <span class="status-pending">Pending</span></p>
            <p><strong>Email:</strong> ${customerEmail}</p>
          </div>
          
          <div class="order-details">
            <h3>Shipping Address</h3>
            <p>${shippingAddress}</p>
          </div>
          
          <div class="order-details">
            <h3>Order Items</h3>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="text-align: right; padding: 10px;"><strong>Subtotal:</strong></td>
                  <td style="text-align: right; padding: 10px;">${formatZAR(subtotal)}</td>
                </tr>
                <tr>
                  <td colspan="2" style="text-align: right; padding: 10px;"><strong>Delivery Fee:</strong></td>
                  <td style="text-align: right; padding: 10px;">${formatZAR(deliveryFee)}</td>
                </tr>
                <tr class="total-row">
                  <td colspan="2" style="text-align: right; padding: 10px;"><strong>Total Due:</strong></td>
                  <td style="text-align: right; padding: 10px;"><strong>${formatZAR(total)}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div class="bank-details">
            <h3>🏦 Payment Instructions</h3>
            <p>Please make payment to the following account:</p>
            <pre>
Bank: First National Bank (FNB)
Account Name: LuChem Cleaning Solutions
Account Number: 63052838019
Branch Code: 250655
Reference: ${customerName.replace(/\s/g, '').toUpperCase()}-${orderId}
            </pre>
            <p><strong>⚠️ Important:</strong> Please use your <strong>NAME</strong> as reference (e.g., JOHNDOE-${orderId})</p>
          </div>
          
          <div class="important-notes">
            <h3>📋 Important Notes</h3>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Payment is due within 7 days of invoice date</li>
              <li>Please use your <strong>NAME</strong> as payment reference</li>
              <li>Once payment is confirmed, your order will be dispatched within 24 hours</li>
              <li>Please email proof of payment to sales@luchem.co.za</li>
              <li>For urgent inquiries, call us on 071 017 7161 / 071 776 7985</li>
            </ul>
          </div>
          
          <div class="company-info">
            <strong>📦 LuChem Cleaning Solutions</strong><br />
            8 Reserwe Street, Oudtshoorn, Western Cape<br />
            Email: sales@luchem.co.za | Phone: 071 017 7161 / 071 776 7985<br />
            VAT Registration: Pending
          </div>
          
          <p>Thank you for choosing LuChem! We appreciate your business.</p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} LuChem Cleaning Solutions. All rights reserved.</p>
          <p>This is a system generated invoice, no signature required.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Configure email transporter
  // For development (Ethereal - fake email for testing)
  let transporter;
  
  // Check if we have real email credentials
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    // Production: Use Gmail/SMTP
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log('📧 Using real email: ' + process.env.EMAIL_USER);
  } else {
    // Development: Use Ethereal (fake email for testing)
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('📧 Using test email (Ethereal)');
  }

  const mailOptions = {
    from: '"LuChem Cleaning Solutions" <sales@luchem.co.za>',
    to: to,
    subject: subject,
    html: html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    
    // For ethereal, log the preview URL
    if (!process.env.EMAIL_USER && info.messageId) {
      console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
      console.log('⚠️ This is a TEST email. Configure real email in production.');
    }
    
    res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email: ' + error.message });
  }
}
