// Returns dashboard numbers. Requires the ADMIN_PASSWORD set in Vercel.
const crypto = require('crypto');
const { pipeline, configured } = require('./_redis');
const P = 'pbdd:';

function same(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

function lastDays(n) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) out.push(new Date(Date.now() - i * 864e5).toISOString().slice(0, 10));
  return out;
}

function hashToObj(arr) {
  const o = {};
  for (let i = 0; arr && i < arr.length; i += 2) o[arr[i]] = Number(arr[i + 1]);
  return o;
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) { res.status(503).json({ error: 'admin-password-not-set' }); return; }
  if (!same(req.headers['x-admin-key'] || '', pw)) { res.status(401).json({ error: 'wrong-password' }); return; }
  if (!configured()) { res.status(503).json({ error: 'storage-not-configured' }); return; }

  const days = lastDays(30);
  const cmds = [['GET', P + 'visits'], ['PFCOUNT', P + 'uv'], ['HGETALL', P + 'clicks'], ['PFCOUNT', P + 'checkout-uv']];
  days.forEach((d) => cmds.push(['GET', P + 'visits:' + d], ['PFCOUNT', P + 'uv:' + d], ['HGETALL', P + 'clicks:' + d]));
  try {
    const r = await pipeline(cmds);
    const daily = days.map((d, i) => {
      const c = hashToObj(r[4 + i * 3 + 2]);
      return { date: d, visits: Number(r[4 + i * 3] || 0), unique: Number(r[4 + i * 3 + 1] || 0),
        clicks: Object.values(c).reduce((a, b) => a + b, 0),
        checkout: Object.keys(c).filter((k) => /^Checkout:/.test(k)).reduce((a, k) => a + c[k], 0) };
    });
    res.status(200).json({
      totals: { visits: Number(r[0] || 0), unique: Number(r[1] || 0), checkoutVisitors: Number(r[3] || 0) },
      clicks: hashToObj(r[2]),
      daily,
    });
  } catch (e) { res.status(503).json({ error: e.message }); }
};
