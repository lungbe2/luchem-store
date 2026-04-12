import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user_id, user_email, items, subtotal, delivery_fee, total, customer, town_id, town_name, payment_method } = req.body;

  try {
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

    // Update product stock
    for (const item of items) {
      await supabase
        .from('products')
        .update({ stock_quantity: supabase.raw(`stock_quantity - ${item.quantity}`) })
        .eq('id', item.id);
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
