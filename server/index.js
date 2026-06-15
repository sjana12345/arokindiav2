import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
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

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

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
      { path: '/', changefreq: 'weekly', priority: '1.0' },
      { path: '/privacy-policy', changefreq: 'yearly', priority: '0.3' },
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
  if (desc)         tags += `  <meta name="description" content="${esc(desc)}" />\n`;
  if (seo.keywords) tags += `  <meta name="keywords" content="${esc(seo.keywords)}" />\n`;
  tags += `  <meta property="og:title" content="${esc(ogTitle)}" />\n`;
  tags += `  <meta property="og:description" content="${esc(ogDesc)}" />\n`;
  tags += `  <meta property="og:type" content="website" />\n`;
  if (seo.ogImage)     tags += `  <meta property="og:image" content="${esc(seo.ogImage)}" />\n`;
  if (seo.canonicalUrl) {
    tags += `  <link rel="canonical" href="${esc(seo.canonicalUrl)}" />\n`;
    tags += `  <meta property="og:url" content="${esc(seo.canonicalUrl)}" />\n`;
  }
  if (seo.twitterHandle) {
    const handle = seo.twitterHandle.startsWith('@') ? seo.twitterHandle : `@${seo.twitterHandle}`;
    tags += `  <meta name="twitter:card" content="summary_large_image" />\n`;
    tags += `  <meta name="twitter:site" content="${esc(handle)}" />\n`;
    tags += `  <meta name="twitter:title" content="${esc(ogTitle)}" />\n`;
    tags += `  <meta name="twitter:description" content="${esc(ogDesc)}" />\n`;
    if (seo.ogImage) tags += `  <meta name="twitter:image" content="${esc(seo.ogImage)}" />\n`;
  }
  if (content.favicon) tags += `  <link rel="icon" href="${esc(content.favicon)}" />\n`;
  if (colors.primary) {
    const p = colors.primary;
    tags += `  <style>:root{--color-purple-300:${hexLighten(p,0.4)};--color-purple-400:${hexLighten(p,0.2)};--color-purple-500:${p};--color-purple-600:${hexDarken(p,0.87)};--color-purple-700:${hexDarken(p,0.75)}}</style>\n`;
  }
  return tags;
}

// ── Static assets + catch-all ────────────────────────────────────────────────

const CLIENT_DIR = path.join(__dirname, '../dist/client');

// Serve built JS/CSS/assets, skip index.html so the catch-all handles it
app.use(express.static(CLIENT_DIR, { index: false }));

app.get('/{*path}', (req, res) => {
  try {
    const template = fs.readFileSync(path.join(CLIENT_DIR, 'index.html'), 'utf-8');
    const content = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const html = template.replace('<!--head-tags-->', buildHeadTags(content));
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
