import { getAdminClient } from '../../../lib/supabase-admin';
import { createPayFastSignature } from '../../../lib/payfast';

const getSiteUrl = () => {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://luchem.co.za';
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabase = getAdminClient();
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase admin client is not configured' });
  }

  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) {
    return res.status(401).json({ error: 'Missing authentication token' });
  }

  const { data: authData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !authData?.user) {
    return res.status(401).json({ error: 'Invalid authentication token' });
  }

  const { orderId, customer = {} } = req.body || {};
  if (!orderId) {
    return res.status(400).json({ error: 'Missing order ID' });
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (orderError || !order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (order.user_id !== authData.user.id) {
    return res.status(403).json({ error: 'You cannot pay for this order' });
  }

  const baseUrl = getSiteUrl();
  const fields = {
    cmd: '_paynow',
    receiver: process.env.PAYFAST_RECEIVER_ID || process.env.NEXT_PUBLIC_PAYFAST_RECEIVER_ID || '34500905',
    return_url: `${baseUrl}/order-confirmation/${order.id}`,
    cancel_url: `${baseUrl}/checkout?payment=cancelled&order=${order.id}`,
    notify_url: `${baseUrl}/api/payfast/notify`,
    amount: Number(order.total_amount).toFixed(2),
    item_name: `LuChem Order #${order.id}`,
    item_description: 'Payment for LuChem cleaning products, raw materials, water, or cleaning services',
    m_payment_id: String(order.id),
    custom_str1: String(order.id),
    name_first: customer.fullName || order.customer_name || '',
    email_address: order.customer_email || '',
    cell_number: customer.phone || order.phone || '',
    line1: customer.address || order.shipping_address || '',
    line2: customer.address_line2 || '',
    city: order.town_name || '',
    region: customer.region || '',
    country: 'South Africa'
  };

  fields.signature = createPayFastSignature(fields, process.env.PAYFAST_PASSPHRASE || '');

  return res.status(200).json({
    processUrl: process.env.PAYFAST_PROCESS_URL || process.env.NEXT_PUBLIC_PAYFAST_PROCESS_URL || 'https://payment.payfast.io/eng/process',
    fields
  });
}
