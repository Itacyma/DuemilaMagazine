[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/uNTgnFHD)
# Exam #N: "Stuff Happens"
## Student: s343608 MARTINI CLAUDIO 

## React Client Application Routes

- Route `/` — Home page: lavagna, pulsanti per avviare una partita, vedere le carte, cronologia e demo.
- Route `/game` — Pagina di gioco: mostra le carte iniziali, i round e il risultato finale.
- Route `/cards` — Visualizza tutte le carte disponibili nel gioco.
- Route `/history` — Mostra la cronologia delle partite dell’utente autenticato.
- Route `/demo` — Permette di provare una demo del gioco senza login.
- Route `/login` — Pagina di login utente.
- Route `*` — Pagina di errore 404 (NotFound).

## API Server

- **POST `/api/login`**
  - Login utente. Body: `{ username, password }`. Risposta: dati utente autenticato.
- **GET `/api/login/current`**
  - Restituisce l'utente autenticato (se presente).
- **DELETE `/api/login/current`**
  - Logout utente.

- **GET `/api/cards`**
  - Restituisce la lista di tutte le carte disponibili (array di oggetti `{ id, title, image_path }`)

- **POST `/api/games`**
  - Crea una nuova partita per l'utente autenticato. Risposta: `{ id, initialCards }` (array di carte iniziali).
- **GET `/api/games/:username`**
  - Restituisce la lista delle partite dell'utente autenticato.
- **GET `/api/games/:gameId/nextRound`**
  - Restituisce la carta per il prossimo round della partita.
- **POST `/api/games/:gameId/guess`**
  - Invia la posizione scelta per la carta del round. Body: `{ guess }`. Risposta: `{ isCorrect, result }`.
- **GET `/api/games/:gameId/cards`**
  - Restituisce le carte vinte nella partita (solo se conclusa).

- **GET `/api/history`**
  - Restituisce la cronologia delle partite dell'utente autenticato, con dettagli su carte e risultati.

- **GET `/api/demo`**
  - Restituisce un set casuale di carte per la demo. Risposta: `{ initialCards, latestCard }`.
- **POST `/api/demo/guess`**
  - Invia la posizione scelta nella demo. Body: `{ initialCards, latestCard, guess }`. Risposta: `{ isCorrect, result }`.


## Database Tables

- Table `users` - contiene: `id`, `username`, `password`, `salt`
- Table `Cards` - contiene: `id`, `title`, `image_path`, `bad_luck_value`
- Table `Rounds` - contiene: `id`, `game_id`, `card_id`, `round_number`, `result`, `created_at`
- Table `Games` - contiene: `id`, `user_id`, `created_at`, `result`

## Main React Components

- `HomePage` (in `Home.jsx`): pagina iniziale, mostra lavagna, pulsanti per avviare una partita, vedere le carte, cronologia e demo.
- `GamePage` (in `Game.jsx`): gestisce il gioco, mostra le carte iniziali, i round e il risultato finale.
- `RoundPage` (in `Round.jsx`): gestisce un singolo round, mostra le carte, i bottoni di scelta e il timer.
- `DemoPage` (in `Demo.jsx`): permette di provare una demo del gioco senza login.
- `CardsPage` (in `Cards.jsx`): mostra tutte le carte disponibili nel gioco.
- `CardSH` (in `Card.jsx`): visualizza una singola carta con titolo, immagine ed eventualmente valore.
- `CircleButton` (in `CircleButton.jsx`): bottone circolare per la scelta della posizione nei round.
- `Timer` (in `Timer.jsx`): visualizza il countdown per il round.
- `HistoryPage` (in `History.jsx`): mostra la cronologia delle partite dell'utente.

## Screenshot

![Home](./server/screenshots/home.png)
![Game](./server/screenshots/game.png)
![History](./server/screenshots/history.png)

## Users Credentials

- root, rootpassword
- itacyma, itacymapassword
