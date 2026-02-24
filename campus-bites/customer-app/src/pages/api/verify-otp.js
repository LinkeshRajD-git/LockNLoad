// Uses the same global OTP store as send-otp.js (keyed by email)
if (!global.__otpStore) global.__otpStore = {};
const otpStore = global.__otpStore;

export default async function handler(req, res) {
  // OTP verification disabled. Keep route for compatibility.
  return res.status(410).json({ message: 'OTP verification disabled' });
}
