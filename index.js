const express = require('express');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const app = express();

// Use memory storage so uploaded files are handled in RAM without creating temp folders
const upload = multer({ storage: multer.memoryStorage() });

// Allow CORS + Chrome Private Network Access (HTTPS freeCodeCamp -> HTTP localhost)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Private-Network', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

// Serve the upload form
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Handle file upload and return metadata JSON (Test 4)
app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  return res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Your app is listening on port ' + port);
});