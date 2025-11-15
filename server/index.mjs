import cors from 'cors';
import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

import DAO from './dao.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = new express();
const port = 3001;

// Configurazione multer per upload immagini profilo
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public', 'profile_images'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile_' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accetta solo immagini
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo file immagine sono permessi'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});


app.use(express.json());
app.use(morgan('dev'));

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

app.use('/public', express.static('public'));
app.use('/profile_images', express.static(path.join(__dirname, 'public', 'profile_images')));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

passport.use(new LocalStrategy(async function verify(username, password, done) {
  const user = await DAO.getUserByUsername(username, password);
  if (!user) return done(null, false, { message: 'Incorrect username or password' });
  return done(null, user);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));


// AUTHENTICATION
app.post('/api/login', passport.authenticate('local'), function(req, res) {
  return res.status(201).json({
    id: req.user.id,
    name: req.user.name,
    username: req.user.username,
    type: req.user.type,
    game: req.user.game
  });
});

app.get('/api/login/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.json({
      id: req.user.id,
      name: req.user.name,
      username: req.user.username,
      type: req.user.type,
      game: req.user.game
    });
  }
  else
    res.status(401).json({error: 'Not authenticated'});
});

app.delete('/api/login/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

// REGISTRAZIONE
app.post('/api/register', upload.single('profilePhoto'), async (req, res) => {
  const { username, name, password, type, age, nickname, presentation } = req.body;
  console.log(req.body);
  console.log('File:', req.file);
  
  if (!username || !name || !password) {
    return res.status(400).json({ error: 'Tutti i campi sono obbligatori.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'La password deve essere di almeno 6 caratteri.' });
  }

  // Se type è 'writer', nickname e presentation sono obbligatori
  if (type === 'writer' && (!nickname || !presentation)) {
    return res.status(400).json({ error: 'Nickname e presentazione sono obbligatori per gli scrittori.' });
  }

  try {
    const existingUser = await DAO.getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ error: 'Username già in uso.' });
    }

    // Se è writer, verifica che il nickname non sia già in uso
    if (type === 'writer') {
      const existingNickname = await DAO.getAuthorByNickname(nickname);
      if (existingNickname) {
        return res.status(409).json({ error: 'Nickname già in uso.' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const userId = await DAO.createUser({ username, name, password: hash, salt, type });

    // Se è writer, crea anche l'entry in Authors
    if (type === 'writer') {
      const profilePhotoPath = req.file ? `/profile_images/${req.file.filename}` : null;
      await DAO.createAuthor({
        user: userId,
        age: Number(age),
        nickname,
        presentation,
        profile_photo: profilePhotoPath,
        insta: null,
        email: null
      });
    }

    return res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Errore nel server.' });
  }
});

// Route pubblica per articoli
app.get('/api/articles/public', async (req, res) => {
  try {
    const articles = await DAO.getAllArticles();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero articoli.' });
  }
});

// Route privata per articoli (solo loggati)
app.get('/api/articles/private', isLoggedIn, async (req, res) => {
  try {
    const articles = await DAO.getAllArticles();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero articoli.' });
  }
});

// Route per articoli propri (solo loggati)
app.get('/api/articles/own', isLoggedIn, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const articles = await DAO.getArticlesByUser(userId);
    console.log(articles);
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero articoli propri.' });
  }
});

// Route per creare un nuovo articolo (solo loggati)
app.post('/api/articles/own/new', isLoggedIn, async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, extract, text, category } = req.body;
    if (!title || !extract || !text || !category) {
      return res.status(400).json({ error: 'Tutti i campi sono obbligatori.' });
    }
    if (extract.length > 330) {
      return res.status(400).json({ error: 'Il riassunto può avere al massimo 330 caratteri.' });
    }
    
    // Recupera l'author_id dalla tabella Authors per questo user
    const author = await DAO.getAuthorByUserId(userId);
    if (!author) {
      return res.status(400).json({ error: 'Devi essere registrato come autore per creare articoli.' });
    }
    
    const newArticle = await DAO.createArticle({
      user: userId,
      author: author.id,
      title,
      extract,
      text,
      category,
      date: dayjs().format('YYYY-MM-DD HH:mm:ss')
    });

    // Crea una entry nella tabella Likes per l'autore

    res.status(201).json(newArticle);
  } catch (err) {
    console.error('Create article error:', err);
    res.status(500).json({ error: 'Errore nella creazione dell\'articolo.' });
  }
});

app.post('/api/articles/:id/visuals', isLoggedIn, async (req, res) => {
  try {
    const userId = req.user.id;
    const articleId = Number(req.params.id);
    
    // Crea o recupera l'interazione
    const interaction = await DAO.createOrGetInteraction(userId, articleId);
    
    // Incrementa il contatore visuals SOLO se è stata appena creata (visual = 1)
    // Se visual > 1, significa che l'utente ha già visualizzato l'articolo
    if (interaction.visual === 1) {
      await DAO.incrementArticleVisuals(articleId);
    }
    
    res.status(204).end();
  } catch (err) {
    console.error('Visual increment error:', err);
    res.status(500).json({ error: 'Errore nell\'incremento delle visualizzazioni.' });
  }
});

app.get('/api/articles/:id/ownership', isLoggedIn, async (req, res) => {
  try {
    const articleId = req.params.id;
    const userId = req.user.id;

    console.log("Checking ownership - articleId:", articleId, "userId:", userId);

    const article = await DAO.getArticleById(articleId);
    if (!article) {
      console.log("Article not found");
      return res.status(404).json({ error: 'Articolo non trovato.' });
    }

    console.log("Article data:", article);
    console.log("Article.user:", article.user, "userId:", userId);

    const isOwner = article.user === userId;
    console.log("isOwner:", isOwner);
    
    res.json({ isOwner });
  } catch (err) {
    console.error('Ownership check error:', err);
    res.status(500).json({ error: 'Errore nella verifica del proprietario.' });
  }
});

app.put('/api/articles/:id', isLoggedIn, async (req, res) => {
  try {
    const articleId = req.params.id;
    const userId = req.user.id;
    const { title, extract, text, category } = req.body;

    // Verifica che l'utente sia il proprietario dell'articolo
    const article = await DAO.getArticleById(articleId);
    if (!article || article.user !== userId) {
      return res.status(403).json({ error: 'Non hai i permessi per modificare questo articolo.' });
    }

    if (!title || !extract || !text || category === undefined || category === null) {
      return res.status(400).json({ error: 'Tutti i campi sono obbligatori.' });
    }
    if (extract.length > 330) {
      return res.status(400).json({ error: 'Il riassunto può avere al massimo 330 caratteri.' });
    }

    const updatedArticle = await DAO.updateArticle(articleId, { title, extract, text, category });
    res.json(updatedArticle);
  } catch (err) {
    console.error('Update article error:', err);
    res.status(500).json({ error: 'Errore nell\'aggiornamento dell\'articolo.' });
  }
});

app.post('/api/articles/:id/likes', isLoggedIn, async (req, res) => {
  try {
    const userId = req.user.id;
    const articleId = Number(req.params.id);
    
    // Toggle del like (l'interazione deve già esistere)
    const newLikeValue = await DAO.toggleLike(userId, articleId);
    
    // Aggiorna il contatore nell'articolo (incrementa o decrementa)
    if (newLikeValue === 1) {
      await DAO.incrementArticleLikes(articleId);
    } else {
      await DAO.decrementArticleLikes(articleId);
    }
    
    res.json({ isLiked: newLikeValue === 1 });
  } catch (err) {
    console.error('Like toggle error:', err);
    res.status(500).json({ error: 'Errore nel toggle del like.' });
  }
});

app.get('/api/articles/:id/likes/check', isLoggedIn, async (req, res) => {
  try {
    const userId = req.user.id;
    const articleId = Number(req.params.id);
    const isLiked = await DAO.isLiked(userId, articleId);
    res.json({ isLiked });
  } catch (err) {
    console.error('Check like error:', err);
    res.status(500).json({ error: 'Errore nel controllo like.' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await DAO.getAllCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero categorie.' });
  }
});

// Route per articoli di un autore specifico (tramite author_id)
app.get('/api/articles/author/:authorId', async (req, res) => {
  try {
    const authorId = req.params.authorId;
    const articles = await DAO.getArticlesByAuthorId(authorId);
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero articoli dell\'autore.' });
  }
});

// FAVOURITES
app.post('/api/favourites/:articleId', isLoggedIn, async (req, res) => {
  try {
    const userId = req.user.id;
    const articleId = Number(req.params.articleId);
    
    if (!Number.isInteger(articleId)) {
      return res.status(400).json({ error: 'Id articolo non valido' });
    }
    
    // Toggle del preferito (l'interazione deve già esistere)
    const newFavValue = await DAO.toggleFavourite(userId, articleId);
    
    return res.status(200).json({ isFavourite: newFavValue === 1 });
  } catch (err) {
    console.error('Favourite toggle error:', err);
    return res.status(500).json({ error: 'Errore nel toggle dei preferiti.' });
  }
});



app.get('/api/favourites', isLoggedIn, async (req, res) => {
  try {
    const userId = req.user.id;
    const favourites = await DAO.getFavouritesByUser(userId);
    res.json(favourites);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero dei preferiti.' });
  }
});

app.get('/api/frequents', isLoggedIn, async (req, res) => {
  try {
    const userId = req.user.id;
    const frequents = await DAO.getFrequentsByUser(userId);
    res.json(frequents);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero degli articoli frequenti.' });
  }
});

// EVENTS

app.get('/api/events', async (req, res) => {
  try {
    const events = await DAO.getAllEvents();
    res.json(events);
  } catch (err) {
    console.error('Get events error:', err);
    res.status(500).json({ error: 'Errore nel recupero degli eventi.' });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'Id evento non valido' });
    }
    const event = await DAO.getEventById(id);
    if (!event) {
      return res.status(404).json({ error: 'Evento non trovato' });
    }
    res.json(event);
  } catch (err) {
    console.error('Get event by id error:', err);
    res.status(500).json({ error: 'Errore nel recupero dell\'evento.' });
  }
});

app.get('/api/favourites/:articleId/check', isLoggedIn, async (req, res) => {
  try {
    const userId = req.user.id;
    const articleId = req.params.articleId;
    const isFav = await DAO.isFavourite(userId, articleId);
    res.json({ isFavourite: isFav });
  } catch (err) {
    res.status(500).json({ error: 'Errore nel controllo preferiti.' });
  }
});


// AUTHORS

app.get('/api/authors', async (req, res) => {
  try {
    const authors = await DAO.getAllAuthors();
    res.json(authors);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero autori.' });
  }
});

app.get('/api/authors/me', isLoggedIn, async (req, res) => {
  try {
    const userId = req.user.id;
    const author = await DAO.getAuthorByUserId(userId);
    if (!author) return res.status(404).json({ error: 'Non sei registrato come autore' });
    res.json(author);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero del profilo autore.' });
  }
});

app.get('/api/authors/user/:userId', async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (!Number.isInteger(userId)) return res.status(400).json({ error: 'Id utente non valido' });
    const author = await DAO.getAuthorByUserId(userId);
    if (!author) return res.status(404).json({ error: 'Autore non trovato per questo utente' });
    res.json(author);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero dell\'autore.' });
  }
});

app.get('/api/authors/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Id autore non valido' });
    const author = await DAO.getAuthorById(id);
    if (!author) return res.status(404).json({ error: 'Autore non trovato' });
    res.json(author);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero dell\'autore.' });
  }
});

app.post('/api/authors', isLoggedIn, async (req, res) => {
  try {
    const userId = req.user.id;
    const { age, insta, email, presentation } = req.body;
    if (!age || !presentation) return res.status(400).json({ error: 'Campi obbligatori mancanti' });
    const created = await DAO.createAuthor({ user: userId, age, insta: insta || null, email: email || null, presentation });
    res.status(201).json(created);
  } catch (err) {
    if (err && err.message && err.message.includes('Autore per questo utente già esistente')) {
      return res.status(409).json({ error: err.message });
    }
    res.status(500).json({ error: 'Errore nella creazione del profilo autore.' });
  }
});

app.put('/api/authors/:id', isLoggedIn, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Id autore non valido' });
    const existing = await DAO.getAuthorById(id);
    if (!existing) return res.status(404).json({ error: 'Autore non trovato' });
    if (existing.user !== req.user.id) return res.status(403).json({ error: 'Non autorizzato' });
    const { age, insta, email, presentation } = req.body;
    const updated = await DAO.updateAuthor({ id, age, insta: insta || null, email: email || null, presentation });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Errore nell\'aggiornamento del profilo autore.' });
  }
});

app.delete('/api/authors/:id', isLoggedIn, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Id autore non valido' });
    const existing = await DAO.getAuthorById(id);
    if (!existing) return res.status(404).json({ error: 'Autore non trovato' });
    if (existing.user !== req.user.id) return res.status(403).json({ error: 'Non autorizzato' });
    await DAO.deleteAuthor(id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Errore nell\'eliminazione del profilo autore.' });
  }
});



