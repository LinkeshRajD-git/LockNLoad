import nodemailer from "nodemailer";

if (typeof global.__otpStore === "undefined") global.__otpStore = {};
const otpStore = global.__otpStore;

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body || {};
  if (!email || typeof email !== "string") {
    return res.status(400).json({ message: "Email is required" });
  }

  const smtpUser = process.env.SMTP_EMAIL;
  const smtpPass = process.env.SMTP_PASSWORD;

  if (!smtpUser || !smtpPass) {
    return res.status(500).json({ message: "Email service not configured" });
  }

  const otp = generateOTP();
  otpStore[email] = { code: otp, expiresAt: Date.now() + 5 * 60 * 1000 };

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: smtpUser, pass: smtpPass },
    });

    const htmlBody = `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;background:#fff;border-radius:16px;border:1px solid #eee;overflow:hidden;">
      <div style="background:#E94E24;padding:24px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:22px;font-weight:900;">LOCK N LOAD</h1>
        <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px;">Order Verification</p>
      </div>
      <div style="padding:28px;text-align:center;">
        <p style="color:#333;font-size:15px;margin:0 0 6px;">Your one-time verification code is:</p>
        <div style="background:#f8f8f8;border-radius:10px;padding:18px;margin:14px 0;border:2px dashed #E94E24;">
          <p style="margin:0;color:#E94E24;font-size:36px;font-weight:900;letter-spacing:10px;font-family:monospace;">${otp}</p>
        </div>
        <p style="color:#888;font-size:12px;margin:0;">This code expires in 5 minutes. Do not share it with anyone.</p>
      </div>
      <div style="background:#f8f8f8;padding:14px;text-align:center;border-top:1px solid #eee;">
        <p style="color:#bbb;font-size:11px;margin:0;">Lock N Load | Open Air Theatre | +91 95978 55779</p>
      </div>
    </div>`;

    await transporter.sendMail({
      from: `"Lock N Load" <${smtpUser}>`,
      to: email,
      subject: `Your Lock N Load OTP: ${otp}`,
      html: htmlBody,
    });

    return res.status(200).json({ success: true, message: "OTP sent to your email!" });
  } catch (err) {
    console.error("Email OTP send error:", err.message);
    return res.status(500).json({ message: "Failed to send OTP. Please try again." });
  }
}
