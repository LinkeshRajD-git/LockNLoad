// SMS sending has been disabled - order confirmations are email-only
export default async function handler(req, res) {
  return res.status(410).json({ message: 'SMS notifications are disabled. Order confirmations are sent via email.' });
}
