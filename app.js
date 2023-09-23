const express = require('express');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const mongoose = require('mongoose');
const path = require('path');
const { log } = require('console');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Connect to MongoDB
mongoose.connect('mongodb://localhost/url_shortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a URL schema for MongoDB
const urlSchema = new mongoose.Schema({
  shortUrl: String,
  longUrl: String,
});

const UrlModel = mongoose.model('Url', urlSchema);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle the root route '/'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = req.params.shortUrl;

  try {
    const urlDocument = await UrlModel.findOne({ shortUrl });
    console.log(urlDocument.longUrl) 
    if (urlDocument) {
      res.redirect(urlDocument.longUrl);
    } else {
      res.status(404).send('URL not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/shorten', async (req, res) => {
  const longUrl = req.body.longUrl;
  console.log(req.body)
  console.log(`the longurl is ${longUrl}`)
  const shortUrl = shortid.generate();

  const urlDocument = new UrlModel({ shortUrl, longUrl });
  console.log(urlDocument)
  try {
    await urlDocument.save();
    res.json({ shortUrl: `${req.protocol}://${req.get('host')}/${shortUrl}` });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

