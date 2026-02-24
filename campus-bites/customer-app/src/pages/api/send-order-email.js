export default async function handler(req, res) {
  // Email functionality disabled. Keep endpoint for compatibility.
  return res.status(410).json({ success: false, message: 'Email service disabled' });
}
