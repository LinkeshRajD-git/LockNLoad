import twilio from 'twilio';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { phone, customerName, orderId, orderItems, totalAmount, paymentMethod } = req.body || {};

  if (!phone || !orderId) {
    return res.status(400).json({ message: 'Phone and orderId are required' });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    console.error('Twilio env vars missing:', { accountSid: !!accountSid, authToken: !!authToken, fromNumber: !!fromNumber });
    return res.status(500).json({ message: 'Twilio environment variables are missing' });
  }

  try {
    const client = twilio(accountSid, authToken);

    // Build order items list
    const itemsList = (orderItems || [])
      .map(item => `  • ${item.name} x${item.quantity} - ₹${item.price * item.quantity}`)
      .join('\n');

    const paymentMode = paymentMethod === 'cod' ? 'Cash on Delivery' : 'PhonePe UPI';

    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

    const messageBody = `🍟 LockNLoad Fries - Order Confirmed!\n\nHi ${customerName || 'Customer'},\n\nYour order has been placed successfully! 🎉\n\n📋 Order ID: ${orderId}\n\n🛒 Items Ordered:\n${itemsList}\n\n💰 Total Amount: ₹${totalAmount}\n💳 Payment Mode: ${paymentMode}\n\n⏱️ Estimated Time: 15-20 minutes\n\nThank you for ordering with LockNLoad Fries! 🙏`;

    await client.messages.create({
      body: messageBody,
      from: fromNumber,
      to: formattedPhone
    });

    return res.status(200).json({ success: true, message: 'SMS sent successfully' });
  } catch (error) {
    console.error('Twilio SMS error:', error);
    // Don't fail the order if SMS fails
    return res.status(200).json({ success: false, message: 'SMS sending failed but order is confirmed', error: error.message });
  }
}
