# Duemila Magazine

Applicazione web per la gestione e pubblicazione di articoli di rivista digitale, con sistema di autenticazione, gestione autori e interazione utente.

## 📋 Caratteristiche

- **Autenticazione utenti**: Sistema di login e registrazione con Passport.js
- **Gestione articoli**: Creazione, modifica e visualizzazione articoli
- **Profili autori**: Pagine dedicate agli autori con informazioni biografiche
- **Sistema preferiti**: Salva i tuoi articoli preferiti
- **Interazioni**: Like e commenti agli articoli
- **Categorizzazione**: Organizzazione degli articoli per categoria
- **Responsive design**: Interfaccia ottimizzata per tutti i dispositivi

## 🛠️ Tecnologie

### Backend
- **Node.js** con Express.js
- **SQLite3** per il database
- **Passport.js** per l'autenticazione (strategia Local)
- **bcrypt** per la crittografia delle password
- **express-session** per la gestione delle sessioni
- **dayjs** per la gestione delle date

### Frontend
- **React 19** con Vite
- **React Router 7** per la navigazione
- **React Bootstrap** per l'UI
- **Bootstrap Icons** per le icone
- **dayjs** per la gestione delle date

## 📦 Installazione

### Prerequisiti
- Node.js (v18 o superiore)
- npm o yarn

### Setup

1. **Clona il repository**
   ```bash
   git clone <url-del-tuo-repository>
   cd "Duemila Magazine"
   ```

2. **Installa le dipendenze del server**
   ```bash
   cd server
   npm install
   ```

3. **Installa le dipendenze del client**
   ```bash
   cd ../client
   npm install
   ```

4. **Configura il database**
   
   Il database SQLite si trova in `server/database/dbDM.sqlite`. Se necessario, puoi ricreare il database usando lo script SQL:
   ```bash
   cd server/database
   sqlite3 dbDM.sqlite < setupDatabase.sql
   ```

## 🚀 Avvio

### Modalità Development

1. **Avvia il server (in una finestra del terminale)**
   ```bash
   cd server
   npm run dev
   ```
   Il server sarà disponibile su `http://localhost:3001`

2. **Avvia il client (in un'altra finestra del terminale)**
   ```bash
   cd client
   npm run dev
   ```
   L'applicazione sarà disponibile su `http://localhost:5173`

### Modalità Production

1. **Build del client**
   ```bash
   cd client
   npm run build
   ```

2. **Avvia il server**
   ```bash
   cd server
   npm start
   ```

## 📁 Struttura del Progetto

```
Duemila Magazine/
├── client/                 # Frontend React
│   ├── public/            # File statici
│   ├── src/
│   │   ├── API/           # Client API per comunicazione con backend
│   │   ├── components/    # Componenti React riutilizzabili
│   │   ├── pages/         # Pagine principali dell'app
│   │   ├── models/        # Modelli dati client
│   │   └── style/         # File CSS
│   └── package.json
│
├── server/                # Backend Node.js
│   ├── database/          # Database SQLite e script setup
│   ├── public/            # File statici serviti dal server
│   │   └── images/        # Immagini degli articoli
│   ├── dao.mjs           # Data Access Object
│   ├── index.mjs         # Entry point del server
│   ├── models.mjs        # Modelli dati server
│   └── package.json
│
├── .gitignore
└── README.md
```

## 🗃️ Schema Database

### Tabelle principali

- **Users**: Utenti registrati
  - `id`, `username`, `name`, `password`, `salt`, `type`, `game`

- **Articles**: Articoli pubblicati
  - `id`, `user` (FK→Users), `author` (FK→Authors), `date`, `title`, `extract`, `text`, `category`, `visuals`, `likes`, `comments`

- **Authors**: Profili autori
  - `id`, `user` (FK→Users), `age`, `nickname`, `insta`, `email`, `presentation`

- **Categories**: Categorie articoli
  - `id`, `name`

- **Favourites**: Articoli salvati come preferiti
  - `user` (FK→Users), `article` (FK→Articles)

- **Likes**: Like degli utenti agli articoli
  - `user` (FK→Users), `article` (FK→Articles)

## 🔑 API Principali

### Autenticazione
- `POST /api/login` - Login utente
- `GET /api/login/current` - Ottieni utente corrente
- `DELETE /api/login/current` - Logout
- `POST /api/register` - Registrazione nuovo utente

### Articoli
- `GET /api/articles/public` - Tutti gli articoli (pubblico)
- `GET /api/articles/private` - Tutti gli articoli (autenticato)
- `GET /api/articles/own` - Articoli dell'utente corrente
- `POST /api/articles/own/new` - Crea nuovo articolo
- `PUT /api/articles/:id` - Modifica articolo
- `GET /api/articles/:id/ownership` - Verifica proprietà articolo
- `GET /api/articles/author/:authorId` - Articoli di un autore

### Preferiti
- `POST /api/favourites/:articleId` - Aggiungi/rimuovi preferito
- `GET /api/favourites` - Ottieni tutti i preferiti
- `GET /api/favourites/:articleId/check` - Verifica se è preferito

### Autori
- `GET /api/authors` - Tutti gli autori
- `GET /api/authors/:id` - Autore per ID
- `GET /api/authors/me` - Profilo autore corrente
- `POST /api/authors` - Crea profilo autore
- `PUT /api/authors/:id` - Modifica profilo autore
- `DELETE /api/authors/:id` - Elimina profilo autore

## 👤 Utenti di Test

Il database include utenti di esempio. Controlla il file `server/database/create-user.mjs` per i dettagli.

## 🔒 Sicurezza

- Password crittografate con bcrypt
- Sessioni gestite con express-session
- Autenticazione via Passport.js
- CORS configurato per localhost:5173
- Verifica lato server della proprietà degli articoli prima delle modifiche

## 📝 Note

- Il server deve essere avviato prima del client
- CORS è configurato per `http://localhost:5173`
- Le immagini degli articoli vanno in `server/public/images/`
- Il database SQLite è escluso dal repository (aggiungerlo manualmente o ricrearlo)

## 🤝 Contribuire

1. Fork del progetto
2. Crea un branch per la feature (`git checkout -b feature/NuovaFeature`)
3. Commit delle modifiche (`git commit -m 'Aggiungi NuovaFeature'`)
4. Push al branch (`git push origin feature/NuovaFeature`)
5. Apri una Pull Request

## 📄 Licenza

ISC

## ✉️ Contatti

Per domande o supporto, apri un issue su GitHub.
