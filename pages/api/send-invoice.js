import { sendInvoiceEmail } from '../../lib/emailService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, orderId, customerName, customerEmail, orderDate, items, subtotal, deliveryFee, total, shippingAddress } = req.body;

  const formatZAR = (amount) => `R${amount.toFixed(2)}`;
  const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  // Format items for email
  const itemsList = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${escapeHtml(item.name)} (${escapeHtml(item.size || 'N/A')})</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatZAR(item.price * item.quantity)}</td>
    </tr>
  `).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>LuChem Invoice #${orderId}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 12px 12px; }
        .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .order-details h3 { margin-top: 0; color: #667eea; }
        .bank-details { background: #f0f7ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .bank-details pre { background: white; padding: 15px; border-radius: 6px; overflow-x: auto; }
        .important-notes { background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ed8936; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; border-top: 1px solid #ddd; margin-top: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #667eea; color: white; padding: 12px; text-align: left; }
        td { padding: 10px; }
        .total-row { font-weight: bold; font-size: 18px; border-top: 2px solid #ddd; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🧼 LuChem Cleaning Solutions</h1>
          <p>Tax Invoice</p>
        </div>
        <div class="content">
          <p>Dear <strong>${escapeHtml(customerName)}</strong>,</p>
          <p>Thank you for your order! Please find your tax invoice below.</p>
          <div class="order-details">
            <h3>Order Information</h3>
            <p><strong>Invoice Number:</strong> #${orderId}</p>
            <p><strong>Invoice Date:</strong> ${orderDate}</p>
            <p><strong>Payment Status:</strong> Pending</p>
          </div>
          <div class="order-details">
            <h3>Shipping Address</h3>
            <p>${escapeHtml(shippingAddress)}</p>
          </div>
          <div class="order-details">
            <h3>Order Items</h3>
            <table>
              <thead><tr><th>Product</th><th>Quantity</th><th>Total</th></tr></thead>
              <tbody>${itemsList}</tbody>
              <tfoot>
                <tr><td colspan="2" style="text-align: right;">Subtotal:</td><td>${formatZAR(subtotal)}</td></tr>
                <tr><td colspan="2" style="text-align: right;">Delivery Fee:</td><td>${formatZAR(deliveryFee)}</td></tr>
                <tr class="total-row"><td colspan="2" style="text-align: right;">Total Due:</td><td><strong>${formatZAR(total)}</strong></td></tr>
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
Reference: ${escapeHtml(customerName).replace(/\s/g, '').toUpperCase()}-${escapeHtml(orderId)}
            </pre>
            <p><strong>⚠️ Important:</strong> Please use your NAME as reference</p>
          </div>
          <div class="important-notes">
            <h3>📋 Important Notes</h3>
            <ul>
              <li>Payment is due within 7 days</li>
              <li>Please use your NAME as payment reference</li>
              <li>Once payment is confirmed, your order will be dispatched within 24 hours</li>
              <li>Email proof of payment to sales@luchem.co.za</li>
            </ul>
          </div>
          <p>Thank you for choosing LuChem!</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} LuChem Cleaning Solutions</p>
          <p>8 Reserwe Street, Oudtshoorn, Western Cape</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const result = await sendInvoiceEmail(to, subject, htmlContent);
    
    if (result.success) {
      console.log('Invoice email sent to:', to);
      res.status(200).json({ success: true, messageId: result.messageId });
    } else {
      console.error('Failed to send email:', result.error);
      res.status(500).json({ error: 'Failed to send email: ' + result.error });
    }
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
