// Import packages
const express = require('express');
var multer = require('multer');
var cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const home = require('./routes/home');
const check = require('./routes/check');

const extract = require('./extract');
const core = require('./core');

// Middleware
const app = express();
app.use(express.json());

app.use(cors());
const ID = uuidv4();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../../tmp');
  },
  filename: function (req, file, cb) {
    if (file.fieldname === 'file') cb(null, `file${ID}.docx`);
    if (file.fieldname === 'data') cb(null, `data${ID}.xlsx`);
  },
});

const upload = multer({ storage: storage }).fields([
  {
    name: 'file',
  },
  {
    name: 'data',
  },
]);

app.use('/api', home);
app.use('/api/check', check);

// Routes
app.get('/api/download', function (req, res) {
  const checkTime = 1000;
  const downloadFile = path.join(__dirname + `../../../tmp/output-${ID}.docx`);
  const timerId = setInterval(() => {
    const isExists = fs.existsSync(downloadFile, 'utf8');
    if (isExists) {
      // do something here
      try {
        res.download(downloadFile);
      } catch (err) {
        console.log(err);
      }
      clearInterval(timerId);
    }
  }, checkTime);
});

app.post('/api/upload', upload, async (req, res) => {
  try {
    res.send({ isPosted: true });
    const data = await extract(`data${ID}.xlsx`);
    core(`file${ID}.docx`, data, ID);
  } catch (err) {
    res.send({ isPosted: false });
  }
});
// comment
// connection
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server Running On PORT: ${port}`));
