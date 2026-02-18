export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { orderId } = req.body || {};
  if (!orderId) {
    return res.status(400).json({ message: 'orderId is required' });
  }

  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;
  const env = process.env.CASHFREE_ENV || 'sandbox';

  const baseUrl = env === 'production'
    ? `https://api.cashfree.com/pg/orders/${orderId}`
    : `https://sandbox.cashfree.com/pg/orders/${orderId}`;

  try {
    const response = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        'x-client-id': appId,
        'x-client-secret': secretKey,
        'x-api-version': '2023-08-01',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Cashfree verify error:', data);
      return res.status(response.status).json({ message: 'Verification failed', details: data });
    }

    return res.status(200).json({
      success: true,
      order_id: data.order_id,
      order_status: data.order_status, // PAID, ACTIVE, EXPIRED, etc.
      order_amount: data.order_amount,
      payment_session_id: data.payment_session_id,
    });
  } catch (error) {
    console.error('Cashfree verify API error:', error);
    return res.status(500).json({ message: 'Verification service error' });
  }
}
