const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// health
app.get('/api/ping', (req, res) => res.json({ ok: true, time: Date.now() }));

// list sample images (remote URLs used)
app.get('/api/samples', (req, res) => {
  res.json({
    images: [
      { id: 1, url: 'https://images.unsplash.com/photo-1524594154909-1d3d45f6f9b8?w=800&q=80' },
      { id: 2, url: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800&q=80' },
      { id: 3, url: 'https://images.unsplash.com/photo-1501004318646-2c7d34e2b5e2?w=800&q=80' }
    ]
  });
});

// upload and mock-detect
app.post('/api/detect', upload.single('image'), (req, res) => {
  // If file present, include URL path
  const file = req.file;
  const imageUrl = file ? `/uploads/${path.basename(file.path)}` : null;

  // Mock detection: randomly choose a disease and attach extended info (life cycle, measures, pesticides)
  const diseases = [
    { name: 'Powdery Mildew', severity: 'Medium' },
    { name: 'Leaf Spot', severity: 'High' },
    { name: 'Early Blight', severity: 'Low' },
    { name: 'Healthy', severity: 'None' }
  ];

  const diseaseInfo = {
    'Powdery Mildew': {
      type: 'Fungal',
      life_cycle: 'Overwinters on plant debris and spreads by wind; favors warm days and cool nights.',
      estimated_days: '7-14 days (with treatment)',
      measures: ['Remove and destroy infected leaves', 'Improve air circulation', 'Apply fungicide as recommended'],
      pesticides: [
        { name: 'Copper Fungicide', image: '/images/pesticide1.svg', use: 'Apply as foliar spray at label rate; repeat every 7–14 days as needed.' }
      ]
    },
    'Leaf Spot': {
      type: 'Fungal',
      life_cycle: 'Fungal spores persist in soil and plant debris; spread by splashing water.',
      estimated_days: '10-21 days (depends on severity)',
      measures: ['Remove affected leaves', 'Avoid overhead irrigation', 'Use protectant fungicides'],
      pesticides: [
        { name: 'Neem Oil', image: '/images/pesticide2.svg', use: 'Use as contact spray for early infections; good preventive option.' }
      ]
    },
    'Early Blight': {
      type: 'Fungal',
      life_cycle: 'Survives on infected soil and residues; spores spread by wind and rain.',
      estimated_days: '10-21 days with correct treatment and removal of debris',
      measures: ['Rotate crops', 'Remove infected debris', 'Apply appropriate fungicide mixtures'],
      pesticides: [
        { name: 'Chlorothalonil', image: '/images/pesticide3.svg', use: 'Apply according to label; rotate active ingredients to limit resistance.' }
      ]
    },
    'Healthy': {
      type: 'None',
      life_cycle: 'N/A',
      estimated_days: 'N/A',
      measures: ['No action needed'],
      pesticides: []
    }
  };

  const pick = diseases[Math.floor(Math.random() * diseases.length)];
  const confidence = (50 + Math.random() * 50).toFixed(1);
  const info = diseaseInfo[pick.name] || null;

  const result = {
    image: imageUrl,
    detection: { ...pick, details: info },
    confidence: `${confidence}%`,
    time: Date.now()
  };

  // Append to results.json
  const RESULTS_FILE = path.join(__dirname, 'results.json');
  let history = [];
  try{ history = JSON.parse(fs.readFileSync(RESULTS_FILE,'utf8')) }catch(e){ history = [] }
  history.unshift(result);
  try{ fs.writeFileSync(RESULTS_FILE, JSON.stringify(history, null, 2)) }catch(e){ }

  res.json(result);
});

// get results
app.get('/api/results', (req, res) => {
  const RESULTS_FILE = path.join(__dirname, 'results.json');
  let history = [];
  try{ history = JSON.parse(fs.readFileSync(RESULTS_FILE,'utf8')) }catch(e){ history = [] }
  res.json({ results: history });
});

// helpers API
app.get('/api/helpers', (req, res) => {
  const FILE = path.join(__dirname, 'helpers.json');
  let helpers = [];
  try{ helpers = JSON.parse(fs.readFileSync(FILE,'utf8')) }catch(e){ helpers = [] }
  res.json({ helpers });
});

app.post('/api/helpers', (req, res) => {
  const FILE = path.join(__dirname, 'helpers.json');
  let helpers = [];
  try{ helpers = JSON.parse(fs.readFileSync(FILE,'utf8')) }catch(e){ helpers = [] }
  const body = req.body;
  const id = Date.now()+ Math.floor(Math.random()*1000);
  const item = { id, name: body.name || 'Unnamed', phone: body.phone || '', email: body.email || '', location: body.location || '', services: body.services || '' };
  helpers.push(item);
  try{ fs.writeFileSync(FILE, JSON.stringify(helpers, null, 2)) }catch(e){ }
  res.json({ ok: true, helper: item });
});

app.delete('/api/helpers/:id', (req, res) => {
  const FILE = path.join(__dirname, 'helpers.json');
  let helpers = [];
  try{ helpers = JSON.parse(fs.readFileSync(FILE,'utf8')) }catch(e){ helpers = [] }
  helpers = helpers.filter(h=>String(h.id)!==String(req.params.id));
  try{ fs.writeFileSync(FILE, JSON.stringify(helpers, null, 2)) }catch(e){ }
  res.json({ ok: true });
});

// serve uploaded files
app.use('/uploads', express.static(UPLOAD_DIR));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
