import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { orderId, orderAmount, customerName, customerEmail, customerPhone } = req.body || {};

  if (!orderId || !orderAmount || !customerEmail) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;
  const env = process.env.CASHFREE_ENV || 'sandbox'; // 'sandbox' or 'production'

  if (!appId || !secretKey) {
    return res.status(500).json({ message: 'Cashfree not configured' });
  }

  const baseUrl = env === 'production'
    ? 'https://api.cashfree.com/pg/orders'
    : 'https://sandbox.cashfree.com/pg/orders';

  const returnUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment-callback?order_id={order_id}`;

  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': appId,
        'x-client-secret': secretKey,
        'x-api-version': '2023-08-01',
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: parseFloat(orderAmount),
        order_currency: 'INR',
        customer_details: {
          customer_id: customerEmail.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 50),
          customer_name: customerName || 'Customer',
          customer_email: customerEmail,
          customer_phone: customerPhone || '9999999999',
        },
        order_meta: {
          return_url: returnUrl,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Cashfree create order error:', data);
      return res.status(response.status).json({
        message: data.message || 'Failed to create payment order',
        details: data,
      });
    }

    return res.status(200).json({
      success: true,
      order_id: data.order_id,
      payment_session_id: data.payment_session_id,
      order_status: data.order_status,
    });
  } catch (error) {
    console.error('Cashfree API error:', error);
    return res.status(500).json({ message: 'Payment service error. Try again.' });
  }
}
