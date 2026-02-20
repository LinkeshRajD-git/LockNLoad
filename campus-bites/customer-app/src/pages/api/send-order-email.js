import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, customerName, orderId, orderItems, totalAmount, paymentMethod } = req.body || {};

  if (!email || !orderId) {
    return res.status(400).json({ message: 'Email and orderId are required' });
  }

  const smtpUser = process.env.SMTP_EMAIL;
  const smtpPass = process.env.SMTP_PASSWORD;

  if (!smtpUser || !smtpPass) {
    console.error('SMTP env vars missing');
    return res.status(200).json({ success: false, message: 'Email config missing, order still confirmed' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const paymentMode = paymentMethod === 'razorpay' ? 'Online Payment (Razorpay)' : 'Online Payment';

    // Build items table rows
    const itemsRows = (orderItems || [])
      .map(
        (item) =>
          `<tr>
            <td style="padding:10px 16px;border-bottom:1px solid #eee;color:#333;">${item.name}</td>
            <td style="padding:10px 16px;border-bottom:1px solid #eee;text-align:center;color:#333;">${item.quantity}</td>
            <td style="padding:10px 16px;border-bottom:1px solid #eee;text-align:right;color:#E94E24;font-weight:bold;">₹${item.price * item.quantity}</td>
          </tr>`
      )
      .join('');

    const htmlBody = `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #eee;">
      <!-- Header -->
      <div style="background:#E94E24;padding:32px 24px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:28px;font-weight:900;letter-spacing:1px;">🍟 LOCK N LOAD</h1>
        <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:14px;">Order Confirmation</p>
      </div>

      <!-- Body -->
      <div style="padding:32px 24px;">
        <p style="color:#333;font-size:16px;margin:0 0 8px;">Hi <strong>${customerName || 'Customer'}</strong>,</p>
        <p style="color:#555;font-size:15px;margin:0 0 24px;">Your order has been placed successfully! 🎉</p>

        <!-- Order ID Card -->
        <div style="background:#f8f8f8;border-radius:12px;padding:20px;margin-bottom:24px;border-left:4px solid #E94E24;">
          <p style="margin:0 0 4px;color:#888;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Order ID</p>
          <p style="margin:0;color:#E94E24;font-size:22px;font-weight:900;font-family:monospace;">${orderId}</p>
        </div>

        <!-- Items Table -->
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <thead>
            <tr style="background:#f5f5f5;">
              <th style="padding:12px 16px;text-align:left;color:#666;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Item</th>
              <th style="padding:12px 16px;text-align:center;color:#666;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Qty</th>
              <th style="padding:12px 16px;text-align:right;color:#666;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <!-- Total -->
        <div style="background:#1a1a1a;border-radius:12px;padding:20px;display:flex;justify-content:space-between;align-items:center;">
          <table style="width:100%;">
            <tr>
              <td style="color:#ccc;font-size:14px;">Payment Method</td>
              <td style="color:#fff;font-size:14px;text-align:right;font-weight:600;">${paymentMode}</td>
            </tr>
            <tr>
              <td style="color:#ccc;font-size:18px;font-weight:bold;padding-top:8px;">Total Amount</td>
              <td style="color:#E94E24;font-size:24px;font-weight:900;text-align:right;padding-top:8px;">₹${totalAmount}</td>
            </tr>
          </table>
        </div>

        <!-- Non-Cancelable Notice -->
        <div style="background:#FFF3CD;border:1px solid #FFEAA7;border-radius:12px;padding:16px 20px;margin-top:24px;text-align:center;">
          <p style="margin:0;color:#856404;font-size:14px;font-weight:700;">
            ⚠️ This order is <span style="color:#dc3545;text-decoration:underline;">NON-CANCELABLE</span> once placed.
          </p>
          <p style="margin:6px 0 0;color:#856404;font-size:13px;">
            Please contact us at +91 95978 55779 for any concerns.
          </p>
        </div>

        <!-- Estimated Time -->
        <div style="text-align:center;margin-top:24px;">
          <p style="color:#555;font-size:14px;margin:0;">
            ⏱️ Estimated preparation time: <strong>15-20 minutes</strong>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background:#f8f8f8;padding:20px 24px;text-align:center;border-top:1px solid #eee;">
        <p style="color:#999;font-size:12px;margin:0;">Thank you for ordering with Lock N Load! 🙏</p>
        <p style="color:#bbb;font-size:11px;margin:8px 0 0;">Open Air Theatre | +91 95978 55779</p>
      </div>
    </div>
    `;

    await transporter.sendMail({
      from: `"Lock N Load" <${smtpUser}>`,
      to: email,
      subject: `🍟 Order Confirmed - ${orderId} | Lock N Load`,
      html: htmlBody,
    });

    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email sending error:', error);
    // Don't fail the order if email fails
    return res.status(200).json({ success: false, message: 'Email sending failed but order is confirmed', error: error.message });
  }
}
