const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const NodeCache = require('node-cache');
const { createObjectCsvWriter } = require('csv-writer');
const sharp = require('sharp');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ====== DATABASE SETUP (SQLite - Big Data Technology 1) ======
const DB_PATH = path.join(__dirname, 'plant_disease.db');
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) console.error('DB Error:', err);
  else console.log('SQLite Database connected');
});

// Initialize database tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS detections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_path TEXT,
    disease_name TEXT,
    confidence REAL,
    severity TEXT,
    disease_type TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id TEXT,
    plant_type TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS detection_analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    metric_name TEXT,
    metric_value REAL,
    date_recorded DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS cache_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cache_key TEXT UNIQUE,
    cache_value TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME
  )`);
});

// ====== CACHE SETUP (Big Data Technology 2) ======
const cache = new NodeCache({ stdTTL: 600 }); // 10 min TTL

// ====== FILE UPLOADS ======
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const CACHE_DIR = path.join(__dirname, 'cache');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR);

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

// ====== UTILITY FUNCTIONS ======
// Get cache or compute
const getCachedOrCompute = (key, computeFn, ttl = 600) => {
  let cached = cache.get(key);
  if (cached) return Promise.resolve(cached);
  return computeFn().then(result => {
    cache.set(key, result, ttl);
    return result;
  });
};

// Store detection in database
const storeDetection = (imageUrl, disease, confidence, severity, diseaseType, userId = 'user_1', plantType = 'unknown') => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO detections (image_path, disease_name, confidence, severity, disease_type, user_id, plant_type) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [imageUrl, disease, confidence, severity, diseaseType, userId, plantType],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
};

// Process image with compression (Big Data Tech - Image Processing)
const processImage = async (filePath) => {
  try {
    const outputPath = path.join(CACHE_DIR, 'processed_' + path.basename(filePath));
    await sharp(filePath)
      .resize(224, 224) // Standard ML input size
      .jpeg({ quality: 80 })
      .toFile(outputPath);
    return outputPath;
  } catch (err) {
    console.error('Image processing error:', err);
    return filePath;
  }
};

// ====== DISEASE DETECTION MODEL (Mock ML - would be TensorFlow in production) ======
const detectDisease = async (imageFile) => {
  // Simulate image validation - check if it's a plant/leaf image
  // In production, this would use a pre-trained model to classify image content
  
  if (!imageFile) {
    return { isInvalid: true, message: 'No image file provided' };
  }

  // Simple validation based on file name and random validation to simulate ML detection
  const fileName = imageFile.originalname.toLowerCase();
  
  // Keywords that suggest non-plant images
  const invalidKeywords = ['person', 'human', 'face', 'people', 'man', 'woman', 'portrait', 'selfie', 'baby', 'child', 'kid'];
  const hasInvalidKeyword = invalidKeywords.some(keyword => fileName.includes(keyword));
  
  if (hasInvalidKeyword) {
    return { 
      isInvalid: true, 
      message: 'Invalid image! Please upload only plant or leaf images. This appears to be a human/person image.' 
    };
  }

  // Simulate ML-based image content detection (30% chance of detecting non-plant content)
  // In production, you would use TensorFlow.js or send to a Python service with actual ML model
  const contentCheck = Math.random();
  
  // If contentCheck is less than 0.3 (30%), treat as invalid (human/non-plant detected)
  // This simulates the ML model detecting faces, people, or non-plant objects
  if (contentCheck < 0.3) {
    return { 
      isInvalid: true, 
      message: 'Invalid image detected! This does not appear to be a plant or leaf image. Please upload only plant/leaf images for disease detection.' 
    };
  }

  // In production, this would use TensorFlow/PyTorch model for plant disease detection
  const diseases = [
    { name: 'Powdery Mildew', severity: 'Medium', type: 'Fungal' },
    { name: 'Leaf Spot', severity: 'High', type: 'Fungal' },
    { name: 'Early Blight', severity: 'Low', type: 'Fungal' },
    { name: 'Healthy', severity: 'None', type: 'None' }
  ];

  const pick = diseases[Math.floor(Math.random() * diseases.length)];
  const confidence = parseFloat((50 + Math.random() * 50).toFixed(1));
  
  return {
    disease: pick.name,
    severity: pick.severity,
    type: pick.type,
    confidence: confidence,
    isInvalid: false
  };
};

// ====== API ENDPOINTS ======

// 1. Health Check
app.get('/api/ping', (req, res) => {
  res.json({ ok: true, time: Date.now(), db: 'connected' });
});

// 2. Sample Images
app.get('/api/samples', (req, res) => {
  res.json({
    images: [
      { id: 1, url: 'https://images.unsplash.com/photo-1524594154909-1d3d45f6f9b8?w=800&q=80' },
      { id: 2, url: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800&q=80' },
      { id: 3, url: 'https://images.unsplash.com/photo-1501004318646-2c7d34e2b5e2?w=800&q=80' }
    ]
  });
});

// 3. Disease Detection with DB Storage
app.post('/api/detect', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ 
        error: true,
        message: 'No image file uploaded' 
      });
    }

    const imageUrl = `/uploads/${path.basename(file.path)}`;
    const userId = req.body.userId || 'user_1';
    const plantType = req.body.plantType || 'unknown';

    // Process image (compression)
    await processImage(file.path);

    // Run ML detection with validation
    const detection = await detectDisease(file);

    // Check if image is invalid
    if (detection.isInvalid) {
      // Delete the uploaded file since it's invalid
      fs.unlinkSync(file.path);
      return res.status(400).json({ 
        error: true,
        isInvalidImage: true,
        message: detection.message || 'Invalid image! Please upload only plant or leaf images.' 
      });
    }

    // Store in database
    const detectionId = await storeDetection(
      imageUrl,
      detection.disease,
      detection.confidence,
      detection.severity,
      detection.type,
      userId,
      plantType
    );

    // Disease information
    const diseaseInfo = {
      'Powdery Mildew': {
        type: 'Fungal',
        life_cycle: 'Overwinters on plant debris and spreads by wind; favors warm days and cool nights.',
        estimated_days: '7-14 days (with treatment)',
        measures: ['Remove and destroy infected leaves', 'Improve air circulation', 'Apply fungicide as recommended'],
        pesticides: [{ name: 'Copper Fungicide', use: 'Apply every 7–14 days as needed.' }],
        suggestions: [
          'Plant resistant varieties when available',
          'Space plants properly to ensure good air circulation',
          'Water plants at soil level in the morning to allow foliage to dry',
          'Use organic methods like sulfur or baking soda spray as preventive treatment',
          'Prune affected areas immediately and dispose of them properly',
          'Apply neem oil or potassium bicarbonate for organic control'
        ],
        prevention: 'Ensure proper spacing between plants, avoid overhead watering, and maintain good garden hygiene by removing plant debris regularly.'
      },
      'Leaf Spot': {
        type: 'Fungal',
        life_cycle: 'Fungal spores persist in soil and plant debris; spread by splashing water.',
        estimated_days: '10-21 days',
        measures: ['Remove affected leaves', 'Avoid overhead irrigation', 'Use protectant fungicides'],
        pesticides: [{ name: 'Neem Oil', use: 'Use as contact spray for early infections.' }],
        suggestions: [
          'Practice crop rotation every 2-3 years',
          'Mulch around plants to prevent soil splash onto leaves',
          'Remove and destroy infected leaves promptly',
          'Use drip irrigation instead of sprinklers',
          'Apply copper-based fungicides during wet conditions',
          'Maintain plant vigor with proper fertilization'
        ],
        prevention: 'Water at the base of plants, avoid wetting foliage, use mulch to prevent soil contact, and practice good sanitation.'
      },
      'Early Blight': {
        type: 'Fungal',
        life_cycle: 'Survives on infected soil and residues; spores spread by wind and rain.',
        estimated_days: '10-21 days',
        measures: ['Rotate crops', 'Remove infected debris', 'Apply fungicide mixtures'],
        pesticides: [{ name: 'Chlorothalonil', use: 'Apply according to label.' }],
        suggestions: [
          'Rotate with non-host crops for at least 3 years',
          'Stake and prune plants to improve airflow',
          'Apply organic mulch to prevent soil splash',
          'Use resistant or tolerant varieties',
          'Start fungicide applications early in the season',
          'Remove lower leaves that touch the soil'
        ],
        prevention: 'Implement 3-year crop rotation, use disease-free seeds, stake plants off the ground, and apply preventive fungicides before disease appears.'
      },
      'Healthy': {
        type: 'None',
        life_cycle: 'N/A',
        estimated_days: 'N/A',
        measures: ['No action needed'],
        pesticides: [],
        suggestions: [
          'Continue proper watering schedules',
          'Maintain balanced fertilization',
          'Monitor regularly for early disease signs',
          'Keep garden clean and weed-free',
          'Ensure adequate spacing for air circulation',
          'Use preventive organic treatments like neem oil spray'
        ],
        prevention: 'Maintain current good practices: proper watering, balanced nutrition, regular monitoring, and good garden hygiene.'
      }
    };

    const result = {
      id: detectionId,
      image: imageUrl,
      detection: {
        name: detection.disease,
        severity: detection.severity,
        details: diseaseInfo[detection.disease] || null
      },
      confidence: `${detection.confidence}%`,
      time: Date.now()
    };

    res.json(result);
  } catch (err) {
    console.error('Detection error:', err);
    res.status(500).json({ error: 'Detection failed' });
  }
});

// 4. Get Detection Results with Cache
app.get('/api/results', (req, res) => {
  getCachedOrCompute('all_results', () => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM detections ORDER BY created_at DESC LIMIT 100`, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }).then(results => {
    res.json({ results, cached: cache.has('all_results') });
  }).catch(err => {
    res.status(500).json({ error: 'Failed to fetch results' });
  });
});

// 5. Analytics - Aggregate Statistics
app.get('/api/analytics', (req, res) => {
  getCachedOrCompute('analytics_data', () => {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        const stats = {};
        
        db.all(`SELECT disease_name, COUNT(*) as count, AVG(confidence) as avg_conf 
                FROM detections GROUP BY disease_name`, (err, diseases) => {
          stats.disease_distribution = diseases || [];
        });

        db.all(`SELECT severity, COUNT(*) as count FROM detections GROUP BY severity`, (err, severity) => {
          stats.severity_distribution = severity || [];
        });

        db.get(`SELECT COUNT(*) as total, AVG(confidence) as avg_confidence FROM detections`, (err, row) => {
          stats.summary = row || {};
          resolve(stats);
        });
      });
    });
  }).then(stats => {
    res.json(stats);
  }).catch(err => {
    res.status(500).json({ error: 'Analytics failed' });
  });
});

// 6. Batch Export (Big Data - CSV Export for analysis)
app.get('/api/export/csv', (req, res) => {
  db.all(`SELECT * FROM detections ORDER BY created_at DESC`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Export failed' });
      return;
    }

    const csvPath = path.join(__dirname, `detections_${Date.now()}.csv`);
    const csvWriter = createObjectCsvWriter({
      path: csvPath,
      header: [
        { id: 'id', title: 'ID' },
        { id: 'disease_name', title: 'Disease' },
        { id: 'confidence', title: 'Confidence' },
        { id: 'severity', title: 'Severity' },
        { id: 'plant_type', title: 'Plant Type' },
        { id: 'created_at', title: 'Date' }
      ]
    });

    csvWriter.writeRecords(rows).then(() => {
      res.download(csvPath, `detections.csv`, (err) => {
        if (!err) fs.unlinkSync(csvPath);
      });
    });
  });
});

// 7. User Detection History
app.get('/api/user/:userId/detections', (req, res) => {
  const userId = req.params.userId;
  getCachedOrCompute(`user_${userId}_detections`, () => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM detections WHERE user_id = ? ORDER BY created_at DESC`, [userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }).then(detections => {
    res.json({ detections });
  }).catch(err => {
    res.status(500).json({ error: 'Failed to fetch user detections' });
  });
});

// 8. Clear Cache
app.post('/api/cache/clear', (req, res) => {
  cache.flushAll();
  res.json({ ok: true, message: 'Cache cleared' });
});

// 9. Database Statistics
app.get('/api/db/stats', (req, res) => {
  db.get(`SELECT COUNT(*) as total_detections FROM detections`, (err, row) => {
    if (err) {
      res.status(500).json({ error: 'Failed to get stats' });
      return;
    }
    res.json({ 
      total_detections: row.total_detections,
      db_location: DB_PATH,
      cache_size: cache.getStats()
    });
  });
});

// ====== HELPERS API (Existing) ======
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

// ====== STATIC FILES ======
app.use('/uploads', express.static(UPLOAD_DIR));

// ====== START SERVER ======
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on ${PORT}`);
  console.log(`📊 Big Data Features: SQLite Database, Caching, CSV Export, Analytics`);
});

process.on('exit', () => {
  db.close();
});
