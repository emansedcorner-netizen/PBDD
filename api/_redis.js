// Minimal Upstash Redis REST client (no dependencies).
// Works with the env vars set by Vercel's Upstash / KV integration.
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

async function pipeline(commands) {
  if (!URL_ || !TOKEN) throw new Error('storage-not-configured');
  const r = await fetch(URL_.replace(/\/$/, '') + '/pipeline', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
  });
  if (!r.ok) throw new Error('redis-' + r.status);
  return (await r.json()).map((x) => x.result);
}

module.exports = { pipeline, configured: () => Boolean(URL_ && TOKEN) };
