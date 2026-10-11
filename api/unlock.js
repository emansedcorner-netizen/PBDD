// Checks a workshop code and, if it matches, returns the checkout link.
// Codes live in the WORKSHOP_CODES env var in Vercel (comma-separated, not case-sensitive).
const crypto = require('crypto');

const CHECKOUT_URL = process.env.CHECKOUT_URL || 'https://academy.thegoodchild.org/pbdd/order/';

function norm(s) { return String(s || '').trim().toUpperCase().replace(/\s+/g, ''); }

function same(a, b) {
  const x = crypto.createHash('sha256').update(a).digest(), y = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(x, y);
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.status(405).json({ ok: false }); return; }
  const codes = String(process.env.WORKSHOP_CODES || '').split(',').map(norm).filter(Boolean);
  if (!codes.length) { res.status(503).json({ ok: false, error: 'codes-not-set' }); return; }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  const code = norm(body && body.code).slice(0, 64);

  // Small delay makes guessing codes slow.
  await new Promise((r) => setTimeout(r, 500));
  const ok = !!code && codes.some((c) => same(c, code));
  if (!ok) { res.status(401).json({ ok: false, error: 'wrong-code' }); return; }
  res.status(200).json({ ok: true, url: CHECKOUT_URL });
};
