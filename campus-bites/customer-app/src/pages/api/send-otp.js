import twilio from "twilio";
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

  const { phone, email } = req.body || {};
  if (typeof phone !== "string" || phone.length < 5) {
    return res.status(400).json({ message: "Phone is required" });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;
  const serviceSid = process.env.TWILIO_SERVICE_SID;
  const smtpUser   = process.env.SMTP_EMAIL;
  const smtpPass   = process.env.SMTP_PASSWORD;

  const otp = generateOTP();
  otpStore[phone] = { code: otp, expiresAt: Date.now() + 5 * 60 * 1000 };

  let smsSent   = false;
  let emailSent = false;

  // SMS via Twilio Verify (serviceSid - no from-number needed)
  if (accountSid && authToken && serviceSid) {
    try {
      const client = twilio(accountSid, authToken);
      await client.verify.v2.services(serviceSid)
        .verifications.create({ to: phone, channel: "sms" });
      smsSent = true;
    } catch (err) {
      console.error("Twilio Verify SMS error:", err.message);
    }
  }

  // Email OTP via nodemailer
  if (email && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: smtpUser, pass: smtpPass },
      });
      const htmlBody = `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;background:#fff;border-radius:16px;border:1px solid #eee;overflow:hidden;"><div style="background:#E94E24;padding:24px;text-align:center;"><h1 style="color:#fff;margin:0;font-size:22px;font-weight:900;">LOCK N LOAD</h1></div><div style="padding:28px;text-align:center;"><p style="color:#333;font-size:15px;">Your order verification code:</p><div style="background:#f8f8f8;border-radius:10px;padding:18px;margin:14px 0;border:2px dashed #E94E24;"><p style="margin:0;color:#E94E24;font-size:34px;font-weight:900;letter-spacing:8px;font-family:monospace;">${otp}</p></div><p style="color:#888;font-size:12px;">Expires in 5 minutes. Do not share.</p></div><div style="background:#f8f8f8;padding:14px;text-align:center;border-top:1px solid #eee;"><p style="color:#bbb;font-size:11px;margin:0;">Lock N Load | Open Air Theatre</p></div></div>`;
      await transporter.sendMail({
        from: `"Lock N Load" <${smtpUser}>`,
        to: email,
        subject: `Your Lock N Load OTP: ${otp}`,
        html: htmlBody,
      });
      emailSent = true;
    } catch (emailErr) {
      console.error("Email OTP send failed:", emailErr.message);
    }
  }

  if (smsSent === false && emailSent === false) {
    return res.status(500).json({ message: "Failed to send OTP. Please try again." });
  }

  const msg = smsSent && emailSent
    ? "OTP sent to your phone & email!"
    : smsSent ? "OTP sent to your phone!"
    : "OTP sent to your email!";

  return res.status(200).json({ success: true, smsSent, emailSent, message: msg });
}
