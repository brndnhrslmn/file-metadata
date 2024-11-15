import "dotenv/config.js";
import express from 'express';
const app = express();
import cors from 'cors';
import multer from "multer";

const storage = multer.diskStorage({
  destination: './public/data/uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage })

app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  var metadata = req.file;
  if (metadata) {
    var response = {
      name: metadata.originalname,
      type: metadata.mimetype,
      size: metadata.size
    };
    res.json(response);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Your app is listening on port ' + port)
});