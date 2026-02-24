import nodemailer from "nodemailer";
let sendgrid;
try {
  sendgrid = await import('@sendgrid/mail');
} catch (e) {
  sendgrid = null;
}

if (typeof global.__otpStore === "undefined") global.__otpStore = {};
const otpStore = global.__otpStore;

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default async function handler(req, res) {
  // OTP/email functionality disabled. Keep route for compatibility.
  return res.status(410).json({ message: 'OTP service disabled' });
}
