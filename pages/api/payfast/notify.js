import { getAdminClient } from '../../../lib/supabase-admin';
import { validatePayFastSignature } from '../../../lib/payfast';

const toNumber = (value) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  const supabase = getAdminClient();
  if (!supabase) {
    return res.status(500).send('Supabase admin client is not configured');
  }

  const payload = req.body || {};
  const signatureValid = validatePayFastSignature(payload, process.env.PAYFAST_PASSPHRASE || '');

  if (!signatureValid) {
    console.error('PayFast notify signature validation failed:', {
      orderId: payload.m_payment_id || payload.custom_str1,
      paymentStatus: payload.payment_status
    });
    return res.status(400).send('Invalid signature');
  }

  const orderId = payload.m_payment_id || payload.custom_str1;
  const paymentStatus = String(payload.payment_status || '').toUpperCase();
  const amountGross = toNumber(payload.amount_gross);

  if (!orderId) {
    return res.status(400).send('Missing order reference');
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id,total_amount')
    .eq('id', orderId)
    .single();

  if (orderError || !order) {
    console.error('PayFast notify order lookup failed:', orderError);
    return res.status(404).send('Order not found');
  }

  const expectedAmount = toNumber(order.total_amount);
  const amountMatches = Math.abs(expectedAmount - amountGross) < 0.01;

  if (!amountMatches) {
    console.error('PayFast amount mismatch:', {
      orderId,
      expectedAmount,
      amountGross
    });
    return res.status(400).send('Amount mismatch');
  }

  const updates = {
    payment_method: 'payfast',
    payment_status: paymentStatus === 'COMPLETE' ? 'paid' : paymentStatus.toLowerCase() || 'pending',
    status: paymentStatus === 'COMPLETE' ? 'processing' : 'pending'
  };

  const { error: updateError } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderId);

  if (updateError) {
    console.error('PayFast notify update failed:', updateError);
    return res.status(500).send('Could not update order');
  }

  return res.status(200).send('OK');
}
