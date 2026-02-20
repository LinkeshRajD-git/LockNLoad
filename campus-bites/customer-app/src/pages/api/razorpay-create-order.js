import Razorpay from 'razorpay';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { amount, orderId } = req.body || {};

  if (!amount || !orderId) {
    return res.status(400).json({ message: 'amount and orderId are required' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return res.status(500).json({ message: 'Razorpay not configured' });
  }

  try {
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await razorpay.orders.create({
      amount: Math.round(parseFloat(amount) * 100), // paise
      currency: 'INR',
      receipt: orderId,
    });

    return res.status(200).json({ razorpayOrderId: order.id, amount: order.amount, currency: order.currency });
  } catch (error) {
    console.error('Razorpay create order error:', error);
    return res.status(500).json({ message: error.error?.description || 'Failed to create payment order' });
  }
}
