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

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `logo${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only image files allowed'));
    cb(null, true);
  },
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
