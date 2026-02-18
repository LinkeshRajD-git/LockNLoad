// Uses the same global OTP store as send-otp.js (keyed by email)
if (!global.__otpStore) global.__otpStore = {};
const otpStore = global.__otpStore;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, code } = req.body || {};
  if (!email || !code) {
    return res.status(400).json({ message: 'Email and code are required' });
  }

  try {
    const stored = otpStore[email];

    if (!stored) {
      return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
    }

    if (Date.now() > stored.expiresAt) {
      delete otpStore[email];
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    if (stored.code !== code) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }

    // OTP verified — clean up
    delete otpStore[email];

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Verify OTP error:', error);
    const message = error?.message || 'Failed to verify OTP';
    return res.status(500).json({ message });
  }
}
