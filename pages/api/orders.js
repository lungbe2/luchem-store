import { getAdminClient } from '../../lib/supabase-admin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user_id, user_email, items, subtotal, delivery_fee, total, customer, town_id, town_name, payment_method } = req.body;
  const supabase = getAdminClient();

  if (!supabase) {
    return res.status(500).json({ error: 'Supabase admin client is not configured' });
  }

  if (!user_id || !user_email || !customer || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Invalid order payload' });
  }

  try {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
    if (!token) {
      return res.status(401).json({ error: 'Missing authentication token' });
    }

    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authData?.user || authData.user.id !== user_id) {
      return res.status(401).json({ error: 'Invalid authentication token' });
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: user_id,
        customer_name: customer.fullName,
        customer_email: user_email,
        phone: customer.phone,
        shipping_address: `${customer.address}${customer.address_line2 ? ', ' + customer.address_line2 : ''}`,
        town_id: town_id,
        town_name: town_name,
        delivery_fee: delivery_fee,
        total_amount: total,
        payment_method: payment_method || 'invoice',
        payment_status: 'pending',
        status: 'pending'
      }])
      .select()
      .single();

    if (orderError) {
      console.error('Order error:', orderError);
      return res.status(500).json({ error: orderError.message });
    }

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Order items error:', itemsError);
      return res.status(500).json({ error: itemsError.message });
    }

    // Update product stock. Supabase JS does not support supabase.raw(), so
    // read/update explicitly and skip non-product cart rows that may live in
    // separate tables.
    for (const item of items) {
      if (item.type && item.type !== 'product') continue;

      const { data: product, error: stockReadError } = await supabase
        .from('products')
        .select('stock_quantity')
        .eq('id', item.id)
        .single();

      if (stockReadError) {
        console.error('Stock read error:', stockReadError);
        continue;
      }

      const nextStock = Math.max(0, Number(product.stock_quantity || 0) - Number(item.quantity || 0));
      const { error: stockUpdateError } = await supabase
        .from('products')
        .update({ stock_quantity: nextStock })
        .eq('id', item.id);

      if (stockUpdateError) {
        console.error('Stock update error:', stockUpdateError);
      }
    }

    return res.status(200).json({ 
      success: true, 
      orderId: order.id,
      message: 'Order placed successfully'
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({ error: error.message });
  }
}
