# The Yelling Rescue Tool

A standalone, self-contained interactive tool (no backend — all state is saved to the browser's `localStorage`). Lives in this subfolder so it can be deployed as its own Vercel project on its own subdomain, separate from the main PBDD sales page at the repo root.

## Files
- `index.html` — the full tool
- `vercel.json` — security headers for this site

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
