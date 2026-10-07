// Records a page visit or a CTA click. Called by the sales page.
const { pipeline } = require('./_redis');

const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse|pingdom|uptime/i;
const P = 'pbdd:';

function today() {
  return new Date().toISOString().slice(0, 10); // UTC date, e.g. 2026-10-07
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.status(405).end(); return; }
  if (BOT.test(req.headers['user-agent'] || '')) { res.status(204).end(); return; }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};
  const type = body.t === 'click' ? 'click' : body.t === 'visit' ? 'visit' : null;
  const vid = String(body.v || '').slice(0, 40).replace(/[^a-z0-9-]/gi, '');
  const label = String(body.l || '').slice(0, 80).trim();
  if (!type || !vid) { res.status(400).end(); return; }

  const d = today();
  const cmds = [];
  if (type === 'visit') {
    cmds.push(['INCR', P + 'visits'], ['INCR', P + 'visits:' + d],
      ['PFADD', P + 'uv', vid], ['PFADD', P + 'uv:' + d, vid],
      ['SADD', P + 'days', d]);
  } else if (label) {
    cmds.push(['HINCRBY', P + 'clicks', label, 1], ['HINCRBY', P + 'clicks:' + d, label, 1],
      ['SADD', P + 'days', d]);
    if (/^Checkout:/.test(label)) cmds.push(['PFADD', P + 'checkout-uv', vid]);
  }
  try { if (cmds.length) await pipeline(cmds); res.status(204).end(); }
  catch (e) { res.status(503).json({ error: e.message }); }
};
