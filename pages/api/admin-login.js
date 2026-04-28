export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body || {};
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    return res.status(500).json({
      error: 'Admin password is not configured. Set ADMIN_PASSWORD in .env.local.'
    });
  }

  if (password !== expectedPassword) {
    return res.status(401).json({ error: 'Wrong password' });
  }

  return res.status(200).json({ success: true });
}
