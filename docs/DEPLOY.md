# Putting monobook.co live on your own hosting

For cPanel-style hosting (Apache or LiteSpeed). The site is plain files: no PHP, no database.

## 1. Build

```bash
npm run build
```

This writes the whole site into `out/`. Everything inside `out/` gets uploaded, including the hidden `.htaccess` file.

To make a zip of it on Windows:

```bash
tar -a -c -f monobook-upload.zip -C out .
```

## 2. Domain and SSL (once)

1. **DNS.** In your domain registrar, point monobook.co at your hosting: either set the hosting company's nameservers, or set an `A` record for `@` to the hosting IP and a `CNAME` for `www` to `monobook.co`. Changes can take a few hours.
2. **SSL.** In cPanel, open **SSL/TLS Status** and run **AutoSSL** for `monobook.co` and `www.monobook.co`. Wait until both show a valid certificate before step 3, because `.htaccess` sends everyone to https.

## 3. Upload

1. In cPanel, open **File Manager** and go to `public_html`.
2. Click **Settings** (top right) and tick **Show Hidden Files**.
3. If there is anything old in `public_html`, download a backup, then delete it. Leave `.well-known` and `cgi-bin` if they exist.
4. **Upload** `monobook-upload.zip` into `public_html`, then right-click it and **Extract**.
5. Check that `index.html`, `.htaccess` and the `_next` folder sit directly in `public_html`, not inside an `out` folder. Delete the zip.

## 4. Check it works

| Open | You should see |
|---|---|
| https://monobook.co | The site, with a padlock |
| http://monobook.co and https://www.monobook.co | Both land on https://monobook.co |
| https://monobook.co/privacy/ | The privacy page |
| https://monobook.co/anything-else | The MonoBook "Page not found" page |
| https://monobook.co/robots.txt and /sitemap.xml | Plain text and XML files |
| https://securityheaders.com, scan monobook.co | Grade A |
| https://pagespeed.web.dev, test monobook.co | 90+ on mobile |

If the site shows "Too many redirects", the hosting is behind a proxy such as Cloudflare. In Cloudflare set SSL to **Full**, or ask your host.

## 5. Search engines (once, after it is live)

1. **Google Search Console** (search.google.com/search-console). Add a **Domain** property for `monobook.co` and verify it with the TXT record it gives you, in your DNS. Then open **Sitemaps** and submit `sitemap.xml`. Under **URL inspection**, enter `https://monobook.co/` and click **Request indexing**.
2. **Bing Webmaster Tools** (bing.com/webmasters). Sign in and choose **Import from Google Search Console**. Bing also feeds ChatGPT search and DuckDuckGo.
3. **Rich Results Test** (search.google.com/test/rich-results). Test `https://monobook.co/`: it should find the Organization data with no errors.
4. **Share previews.** Paste the link into the LinkedIn Post Inspector and the Facebook Sharing Debugger, so they fetch the orange share image.
5. **Your profiles.** Put `https://monobook.co` on your Behance, Dribbble and LinkedIn profiles, with the same name, "MonoBook Brand Architects". Links from them help Google trust the site. (The site itself has no social links, by the brief.)

Give Google one to four weeks. In Search Console, watch **Performance** for the searches people find you with.

## 6. Email, so replies do not go to spam

The site is email only, so this matters as much as the website. Wherever `mehedi@monobook.co` is hosted, add the three DNS records it asks for:

- **SPF** (a TXT record that lists who may send for monobook.co)
- **DKIM** (a TXT record your email provider generates)
- **DMARC**: a TXT record named `_dmarc` with the value `v=DMARC1; p=none; rua=mailto:mehedi@monobook.co` to start

Then send a test to https://www.mail-tester.com and aim for 9/10 or better.

## 7. Updating the site later

1. Change the copy in `content/copy.ts`, then `npm run build`.
2. Zip `out/` again (step 1).
3. In `public_html`, delete everything except `.well-known` and `cgi-bin`, upload and extract the new zip. Deleting first matters: old files in `_next` would otherwise pile up.
4. In Search Console, request indexing again if the home page changed a lot.
