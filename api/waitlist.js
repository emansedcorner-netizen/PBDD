// Adds an email to the PBDD waitlist segment in Flodesk.
// Needs FLODESK_API_KEY and WAITLIST_SEGMENT_ID set in Vercel.
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.status(405).json({ ok: false }); return; }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  const email = String((body && body.email) || '').trim().toLowerCase().slice(0, 254);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { res.status(400).json({ ok: false, error: 'bad-email' }); return; }

  const key = process.env.FLODESK_API_KEY, segment = process.env.WAITLIST_SEGMENT_ID;
  if (!key || !segment) { res.status(503).json({ ok: false, error: 'not-configured' }); return; }

  try {
    const r = await fetch('https://api.flodesk.com/v1/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Basic ' + Buffer.from(key + ':').toString('base64') },
      body: JSON.stringify({ email, segment_ids: [segment] }),
    });
    if (!r.ok) { res.status(502).json({ ok: false, error: 'flodesk-failed' }); return; }
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(502).json({ ok: false, error: 'flodesk-failed' });
  }
};
