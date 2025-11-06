import cors from 'cors';
import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import dayjs from 'dayjs';

import DAO from './dao.mjs';

const app = new express();
const port = 3001;


app.use(express.json());
app.use(morgan('dev'));

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

app.use('/public', express.static('public'));

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
app.post('/api/register', async (req, res) => {
  const { username, name, password, type } = req.body;
  console.log(req.body);
  if (!username || !name || !password) {
    return res.status(400).json({ error: 'Tutti i campi sono obbligatori.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'La password deve essere di almeno 6 caratteri.' });
  }

  try {
    const existingUser = await DAO.getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ error: 'Username già in uso.' });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    await DAO.createUser({ username, name, password: hash, salt, type });
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
    await DAO.createLikeEntry(newArticle.id, userId);

    res.status(201).json(newArticle);
  } catch (err) {
    console.error('Create article error:', err);
    res.status(500).json({ error: 'Errore nella creazione dell\'articolo.' });
  }
});

app.post('/api/articles/:id/visuals', isLoggedIn, async (req, res) => {
  try {
    const articleId = req.params.id;
    await DAO.incrementArticleVisuals(articleId);
    res.status(204).end();
  } catch (err) {
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

    if (!title || !extract || !text || !category) {
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
    const articleId = req.params.id;
    await DAO.incrementArticleLikes(articleId);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Errore nell\'incremento dei like.' });
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

    // Controlla se è già nei preferiti
    const currentlyFav = await DAO.isFavourite(userId, articleId);

    if (currentlyFav) {
      // se presente, rimuovi
      await DAO.removeFromFavourites(userId, articleId);
    } else {
      // altrimenti aggiungi
      await DAO.addToFavourites(userId, articleId);
    }

    // restituisci lo stato attuale
    const nowFav = await DAO.isFavourite(userId, articleId);
    return res.status(200).json({ isFavourite: !!nowFav });
  } catch (err) {
    // gestisci errori prevedibili
    if (err && (err.message === 'Articolo già nei preferiti' || err.message === 'Articolo non trovato nei preferiti')) {
      return res.status(409).json({ error: err.message });
    }
    console.error('Favourite toggle error:', err);
    return res.status(500).json({ error: 'Errore nell\'aggiunta o rimozione dai preferiti.' });
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



