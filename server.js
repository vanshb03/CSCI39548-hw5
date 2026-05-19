require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  genre: { type: String, required: true },
});

const Song = mongoose.model('Song', songSchema);

// GET - all songs 
app.get('/', async (req, res) => {
  const songs = await Song.find();
  res.render('index', { songs });
});

// POST - add new song
app.post('/songs', async (req, res) => {
  const { title, artist, genre } = req.body;
  await Song.create({ title, artist, genre });
  res.redirect('/');
});

// GET - render edit form
app.get('/songs/:id/edit', async (req, res) => {
  const song = await Song.findById(req.params.id);
  res.render('edit', { song });
});

// PUT - save changes
app.put('/songs/:id', async (req, res) => {
  const { title, artist, genre } = req.body;
  await Song.findByIdAndUpdate(req.params.id, { title, artist, genre });
  res.redirect('/');
});

// DELETE - delete song
app.delete('/songs/:id', async (req, res) => {
  await Song.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
