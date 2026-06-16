import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config({ path: './server/.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;
const SECRET_KEY = process.env.JWT_SECRET || 'arok_india_super_secret_2026';
const DATA_FILE = path.join(__dirname, 'data.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const ICONS_DIR = path.join(__dirname, 'icons');

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);
if (!fs.existsSync(ICONS_DIR)) fs.mkdirSync(ICONS_DIR);

const makeStorage = (baseName) =>
  multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
    filename: (_req, file, cb) => cb(null, `${baseName}${path.extname(file.originalname)}`),
  });

const imageFilter = (_req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) return cb(new Error('Only image files allowed'));
  cb(null, true);
};

const upload = multer({ storage: makeStorage('logo'), limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: imageFilter });
const uploadFavicon = multer({ storage: makeStorage('favicon'), limits: { fileSize: 2 * 1024 * 1024 }, fileFilter: imageFilter });

// Icon-specific multer — saves with an exact filename into ICONS_DIR
// Accept all file types (admin knows what they're uploading)
const makeIconUpload = (filename) =>
  multer({
    storage: multer.diskStorage({
      destination: (_req, _file, cb) => cb(null, ICONS_DIR),
      filename: (_req, _file, cb) => cb(null, filename),
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, _file, cb) => cb(null, true),
  });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  // For demo: password is 'arok2026'
  if (username === 'admin' && password === 'arok2026') {
    const token = jwt.sign({ username: 'admin' }, SECRET_KEY, { expiresIn: '1h' });
    return res.json({ token });
  }
  
  res.status(401).json({ message: 'Invalid credentials' });
});

app.get('/api/content', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Error reading data' });
    res.json(JSON.parse(data));
  });
});

// Public for testing - remove in production
app.post('/api/content', (req, res) => {
  const newData = req.body;
  fs.writeFile(DATA_FILE, JSON.stringify(newData, null, 2), (err) => {
    if (err) return res.status(500).json({ message: 'Error saving data' });
    res.json({ message: 'Content updated successfully' });
  });
});

// Logo Upload
app.post('/api/upload/logo', authenticateToken, upload.single('logo'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const logoUrl = `/uploads/${req.file.filename}`;
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Error reading data' });
    const content = JSON.parse(data);
    content.logo = logoUrl;
    fs.writeFile(DATA_FILE, JSON.stringify(content, null, 2), (writeErr) => {
      if (writeErr) return res.status(500).json({ message: 'Error saving logo' });
      res.json({ message: 'Logo uploaded successfully', logoUrl });
    });
  });
});

// Favicon Upload
app.post('/api/upload/favicon', authenticateToken, uploadFavicon.single('favicon'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const faviconUrl = `/uploads/${req.file.filename}`;
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Error reading data' });
    const content = JSON.parse(data);
    content.favicon = faviconUrl;
    fs.writeFile(DATA_FILE, JSON.stringify(content, null, 2), (writeErr) => {
      if (writeErr) return res.status(500).json({ message: 'Error saving favicon' });
      res.json({ message: 'Favicon uploaded successfully', faviconUrl });
    });
  });
});

// Icon file uploads (saved to ICONS_DIR, served at site root)
const ICON_ROUTES = [
  { route: 'apple-touch-icon', filename: 'apple-touch-icon.png' },
  { route: 'favicon-png',      filename: 'favicon-96x96.png'    },
  { route: 'favicon-svg',      filename: 'favicon.svg'          },
  { route: 'favicon-ico',      filename: 'favicon.ico'          },
];

for (const { route, filename } of ICON_ROUTES) {
  app.post(`/api/upload/icon/${route}`, authenticateToken, makeIconUpload(filename).single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    res.json({ message: `${filename} uploaded`, url: `/${filename}` });
  });
}

// Icon status — tells the client which files have been uploaded
app.get('/api/icons/status', (_req, res) => {
  const files = ['apple-touch-icon.png', 'favicon-96x96.png', 'favicon.svg', 'favicon.ico', 'site.webmanifest'];
  const status = Object.fromEntries(files.map(f => [f, fs.existsSync(path.join(ICONS_DIR, f))]));
  res.json(status);
});

// Web App Manifest
app.get('/api/manifest', (_req, res) => {
  const p = path.join(ICONS_DIR, 'site.webmanifest');
  res.json({ manifest: fs.existsSync(p) ? fs.readFileSync(p, 'utf-8') : '' });
});

app.post('/api/manifest', authenticateToken, (req, res) => {
  fs.writeFile(path.join(ICONS_DIR, 'site.webmanifest'), req.body.manifest || '', (err) => {
    if (err) return res.status(500).json({ message: 'Error saving manifest' });
    res.json({ message: 'Manifest saved' });
  });
});

// WhatsApp API Endpoint
app.post('/api/enquiry', async (req, res) => {
  const { name, eventType, date, location, message } = req.body;
  
  const phoneNumberId = process.env.WHATSAPP_PHONE_ID;
  const accessToken = process.env.WHATSAPP_API_KEY;
  const toNumber = process.env.WHATSAPP_TO_NUMBER;
  
  try {
    if (!phoneNumberId || !accessToken) {
      return res.status(500).json({ success: false, message: 'WhatsApp API not configured' });
    }
    
    const response = await fetch(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: toNumber,
        type: 'template',
        template: {
          name: 'enquiry_form',
          language: { code: 'en_US' },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', parameter_name: 'name', text: name },
                { type: 'text', parameter_name: 'event_type', text: eventType },
                { type: 'text', parameter_name: 'date', text: date },
                { type: 'text', parameter_name: 'location', text: location },
                { type: 'text', parameter_name: 'user_message', text: message }
              ]
            }
          ]
        }
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      res.json({ success: true, message: 'Enquiry sent via WhatsApp!', data });
    } else {
      res.status(500).json({ success: false, message: data.error?.message || 'Failed to send message', error: data });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error sending message', error: error.message });
  }
});

// Sitemap
app.get('/sitemap.xml', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error generating sitemap');
    const content = JSON.parse(data);
    const base = (content.seo?.canonicalUrl || 'https://arokindia.net').replace(/\/$/, '');
    const today = new Date().toISOString().split('T')[0];

    const staticRoutes = [
      { path: '/',            changefreq: 'weekly',  priority: '1.0' },
      { path: '/about',       changefreq: 'monthly', priority: '0.8' },
      { path: '/team',        changefreq: 'monthly', priority: '0.8' },
      { path: '/gigs',        changefreq: 'weekly',  priority: '0.9' },
      { path: '/portfolio',   changefreq: 'monthly', priority: '0.8' },
      { path: '/gallery',     changefreq: 'monthly', priority: '0.7' },
      { path: '/contact',     changefreq: 'yearly',  priority: '0.7' },
      { path: '/privacy-policy',   changefreq: 'yearly', priority: '0.3' },
      { path: '/terms-of-service', changefreq: 'yearly', priority: '0.3' },
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes
  .map(
    (r) => `  <url>
    <loc>${base}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.send(xml);
  });
});

// Robots.txt
app.get('/robots.txt', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error');
    const content = JSON.parse(data);
    const base = (content.seo?.canonicalUrl || 'https://arokindia.net').replace(/\/$/, '');
    const robotsTxt =
      content.seo?.robotsTxt ||
      `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /login\n\nSitemap: ${base}/sitemap.xml`;
    res.setHeader('Content-Type', 'text/plain');
    res.send(robotsTxt);
  });
});

// ── Helpers for server-side HTML injection ──────────────────────────────────

const hexChannel = (hex, start) => parseInt(hex.replace('#', '').slice(start, start + 2), 16);

const hexDarken = (hex, f) =>
  '#' + [0, 2, 4].map(i => Math.min(255, Math.round(hexChannel(hex, i) * f)).toString(16).padStart(2, '0')).join('');

const hexLighten = (hex, f) =>
  '#' + [0, 2, 4].map(i => Math.min(255, Math.round(hexChannel(hex, i) + (255 - hexChannel(hex, i)) * f)).toString(16).padStart(2, '0')).join('');

const esc = (s) => String(s).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function buildHeadTags(content) {
  const seo = content.seo || {};
  const colors = content.colors || {};
  const title = seo.title || 'AROK INDIA';
  const desc = seo.description || '';
  const ogTitle = seo.ogTitle || title;
  const ogDesc = seo.ogDescription || desc;

  let tags = `<title>${esc(title)}</title>\n`;
  tags += `  <meta name="robots" content="${esc(seo.metaRobots || 'index, follow')}" />\n`;
  if (seo.author)    tags += `  <meta name="author" content="${esc(seo.author)}" />\n`;
  if (seo.publisher) tags += `  <meta name="publisher" content="${esc(seo.publisher)}" />\n`;
  if (desc)         tags += `  <meta name="description" content="${esc(desc)}" />\n`;
  if (seo.keywords) tags += `  <meta name="keywords" content="${esc(seo.keywords)}" />\n`;
  tags += `  <meta property="og:title" content="${esc(ogTitle)}" />\n`;
  tags += `  <meta property="og:description" content="${esc(ogDesc)}" />\n`;
  tags += `  <meta property="og:type" content="${esc(seo.ogType || 'website')}" />\n`;
  if (seo.ogImage) {
    tags += `  <meta property="og:image" content="${esc(seo.ogImage)}" />\n`;
    if (seo.ogImageWidth)  tags += `  <meta property="og:image:width" content="${esc(seo.ogImageWidth)}" />\n`;
    if (seo.ogImageHeight) tags += `  <meta property="og:image:height" content="${esc(seo.ogImageHeight)}" />\n`;
    if (seo.ogImageType)   tags += `  <meta property="og:image:type" content="${esc(seo.ogImageType)}" />\n`;
    if (seo.ogImageAlt)    tags += `  <meta property="og:image:alt" content="${esc(seo.ogImageAlt)}" />\n`;
  }
  const ogUrlValue = seo.ogUrl || seo.canonicalUrl;
  if (ogUrlValue) {
    tags += `  <meta property="og:url" content="${esc(ogUrlValue)}" />\n`;
  }
  if (seo.canonicalUrl) {
    tags += `  <link rel="canonical" href="${esc(seo.canonicalUrl)}" />\n`;
  }
  {
    const twitterCard = seo.twitterCard || 'summary_large_image';
    const twitterTitle = seo.twitterTitle || ogTitle;
    const twitterDesc = seo.twitterDescription || ogDesc;
    const twitterImg = seo.twitterImage || seo.ogImage;
    tags += `  <meta name="twitter:card" content="${esc(twitterCard)}" />\n`;
    if (seo.twitterHandle) {
      const handle = seo.twitterHandle.startsWith('@') ? seo.twitterHandle : `@${seo.twitterHandle}`;
      tags += `  <meta name="twitter:site" content="${esc(handle)}" />\n`;
    }
    if (seo.twitterCreator) {
      const creator = seo.twitterCreator.startsWith('@') ? seo.twitterCreator : `@${seo.twitterCreator}`;
      tags += `  <meta name="twitter:creator" content="${esc(creator)}" />\n`;
    }
    tags += `  <meta name="twitter:title" content="${esc(twitterTitle)}" />\n`;
    tags += `  <meta name="twitter:description" content="${esc(twitterDesc)}" />\n`;
    if (twitterImg) tags += `  <meta name="twitter:image" content="${esc(twitterImg)}" />\n`;
  }
  if (seo.googleVerification) tags += `  <meta name="google-site-verification" content="${esc(seo.googleVerification)}" />\n`;
  if (seo.bingVerification)  tags += `  <meta name="msvalidate.01" content="${esc(seo.bingVerification)}" />\n`;
  if (seo.googleTagManagerId) {
    const gtmId = esc(seo.googleTagManagerId.trim());
    tags += `  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');</script>\n`;
  }
  if (seo.googleAnalyticsId) {
    const gaId = esc(seo.googleAnalyticsId.trim());
    tags += `  <script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>\n`;
    tags += `  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');</script>\n`;
  }
  if (seo.structuredData) {
    const safeJsonLd = seo.structuredData.replace(/<\/script>/gi, '<\\/script>');
    tags += `  <script type="application/ld+json">${safeJsonLd}</script>\n`;
  }
  const faviconHref = content.favicon || '/favicon.svg';
  tags += `  <link rel="icon" href="${esc(faviconHref)}" />\n`;
  tags += `  <link rel="apple-touch-icon" href="${esc(faviconHref)}" />\n`;
  if (colors.primary) {
    const p = colors.primary;
    tags += `  <style>:root{--color-purple-300:${hexLighten(p,0.4)};--color-purple-400:${hexLighten(p,0.2)};--color-purple-500:${p};--color-purple-600:${hexDarken(p,0.87)};--color-purple-700:${hexDarken(p,0.75)}}</style>\n`;
  }
  return tags;
}

// ── Static assets + SSR catch-all ────────────────────────────────────────────

const CLIENT_DIR = path.join(__dirname, '../dist/client');
const SERVER_ENTRY = path.join(__dirname, '../dist/server/entry-server.js');

// Icons uploaded via Admin are served at the root path (highest priority)
app.use(express.static(ICONS_DIR));
// Serve built JS/CSS/assets, skip index.html so the catch-all handles it
app.use(express.static(CLIENT_DIR, { index: false }));

let ssrRender = null;

app.get('/{*path}', async (req, res) => {
  try {
    const template = fs.readFileSync(path.join(CLIENT_DIR, 'index.html'), 'utf-8');
    const content = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

    // Lazy-load SSR bundle once; fall back to empty string on any error
    if (!ssrRender) {
      try {
        const mod = await import(pathToFileURL(SERVER_ENTRY).href);
        ssrRender = mod.render;
      } catch (e) {
        console.warn('SSR bundle unavailable:', e.message);
      }
    }

    let appHtml = '';
    if (ssrRender) {
      try {
        // Make CMS content available to useContent() during renderToString
        globalThis.__INITIAL_CONTENT__ = content;
        appHtml = ssrRender(req.url);
      } catch (e) {
        console.warn('SSR render failed, falling back to client-only:', e.message);
      } finally {
        delete globalThis.__INITIAL_CONTENT__;
      }
    }

    // Inject content for instant client access (avoids blank flash before API fetch)
    const safeContent = JSON.stringify(content).replace(/<\/script>/gi, '<\\/script>');
    const initScript = `<script>window.__INITIAL_CONTENT__=${safeContent}</script>`;

    const html = template
      .replace('<!--head-tags-->', buildHeadTags(content) + '\n  ' + initScript)
      .replace('<!--app-html-->', appHtml);

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (e) {
    console.error('Server error:', e);
    res.status(500).send('Server error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
