# Parenting by Divine Design sales page

This folder is ready to deploy as a static site on Netlify.

## Files
- `index.html` — the full sales page
- `netlify.toml` — basic Netlify configuration and security headers

## Deploy with GitHub + Netlify
1. Create a new GitHub repository.
2. Upload the contents of this folder to the repository root.
3. In Netlify, choose **Add new site → Import an existing project → GitHub**.
4. Select the repository.
5. Build command: leave blank.
6. Publish directory: `.`
7. Deploy.

## Connect `program.thegoodchild.org`
1. In Netlify, open **Domain management** and add `program.thegoodchild.org`.
2. Netlify will show the target hostname for your site, usually something like `your-site-name.netlify.app`.
3. In Squarespace DNS for `thegoodchild.org`, add a CNAME record:
   - Host/Name: `program`
   - Type: `CNAME`
   - Data/Points to: your Netlify hostname, without `https://`
4. Do not change the root (`@`) or `www` DNS records.
5. Wait for Netlify to verify the DNS and issue HTTPS.

## Checkout
The two payment buttons currently link to:
`https://academy.thegoodchild.org/pbdd/order/`

## Before sending traffic
- Test the page on desktop and mobile.
- Test both payment buttons.
- Confirm the custom domain loads over HTTPS.
- Add analytics / Meta Pixel if needed.
