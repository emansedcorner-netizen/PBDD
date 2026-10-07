# The Yelling Rescue Tool

A standalone interactive tool. Progress is saved to the browser's `localStorage`; the only server-side piece is the Flodesk subscribe call below. Lives in this subfolder so it can be deployed as its own Vercel project on its own subdomain, separate from the main PBDD sales page at the repo root.

## Files
- `index.html` — the full tool
- `api/subscribe.js` — Vercel serverless function that adds the submitted email to Flodesk
- `vercel.json` — security headers for this site

## Flodesk integration
When someone enters their email on the lead-capture screen, the page calls `/api/subscribe`, which adds them to this Flodesk segment: https://app.flodesk.com/segment/6ac6ad1d751120d0163874d2

This requires one setup step that only you can do (it needs your Flodesk account):
1. In Flodesk, go to **Settings → Integrations → API keys** and create/copy an API key.
2. In the `pbdd-yelling-rescue` Vercel project, go to **Settings → Environment Variables** and add:
   - Name: `FLODESK_API_KEY`
   - Value: the key you copied
   - Environment: Production (and Preview, if you want preview deploys to also subscribe people)
3. Redeploy (Vercel → Deployments → latest → ⋯ → Redeploy) so the function picks up the new variable.

Until that variable is set, the page still works fine for visitors — the subscribe call just fails silently in the background (caught, non-blocking) and nothing is added to Flodesk. I can't test this end-to-end myself: I don't have a Flodesk API key, and this environment can't reach Flodesk's API to verify the request shape. After you add the key, submit a test email on the live page and confirm it shows up in that Flodesk segment.

## Fixed for this launch
The hero illustration's layout box was intrinsically wider than its grid column, so at desktop widths it overlapped and sat on top of the "Let's start" button — the button was unclickable. Fixed by constraining `.portrait` to `width:100%;min-width:0` so it respects its grid column instead of forcing the column to grow. Verified headlessly end-to-end (all 14 screens) at both 1440×900 (desktop) and 390×844 (mobile) with no console errors.

## Deploy as a separate Vercel project (same repo, different subdomain)
Vercel lets you import the **same GitHub repo more than once** as separate projects, each with its own Root Directory and domain:

1. In Vercel, click **Add New → Project → Import** this same GitHub repository.
2. When configuring the project, set:
   - Root Directory: `yelling-rescue`
   - Framework Preset: **Other** (it's static HTML, no build step)
   - Build Command / Output Directory: leave default/blank
3. Deploy. You'll get a `your-project-name.vercel.app` URL serving this tool at its root.

## Connect `yelling.thegoodchild.org`
1. In the Vercel project, open **Settings → Domains** and add `yelling.thegoodchild.org`.
2. Vercel will show you the DNS record to add — for a subdomain this is normally a CNAME record pointing to `cname.vercel-dns.com`.
3. In Squarespace DNS for `thegoodchild.org`, add a CNAME record:
   - Host/Name: `yelling`
   - Type: `CNAME`
   - Data/Points to: `cname.vercel-dns.com` (use whatever exact value Vercel's Domains page shows you)
4. Do not change the root (`@`), `www`, or `program` DNS records — this is an additional record alongside them.
5. Wait for DNS to propagate; Vercel will auto-issue HTTPS once it verifies the record.

## Before sending traffic
- Test the full flow on desktop and mobile (already QA'd headlessly at 1440×900 and 390×844 — all 14 screens advance without errors).
- Note: the page references `manifest.webmanifest`, `icon.svg`, and `config.js`, which don't exist yet. They're optional (no PWA install prompt, no custom tab icon, and `config.js` isn't required by any of the tool's logic) — add them later if you want the install-to-home-screen / branded-icon experience.
