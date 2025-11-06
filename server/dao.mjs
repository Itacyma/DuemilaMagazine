import crypto from "crypto";
import sqlite from "sqlite3";
import dayjs from "dayjs";
import bcrypt from "bcrypt";
import { User, Article, Author } from "./models.mjs";

const db = new sqlite.Database("./database/dbDM.sqlite", (err) => {
    if (err) throw err;
});
db.serialize(); // Imposta la modalità serialized per evitare lock concorrenti

function getCategoryNameById(categoryId) {
    return new Promise((resolve, reject) => {
        db.get("SELECT name FROM Categories WHERE id = ?", [categoryId], (err, row) => {
            if (err) return resolve(""); // Risolvi comunque con stringa vuota
            resolve(row ? row.name : "");
        });
    });
}

const DAO = {
    // AUTHENTICATION
    createUser({ username, name, password, salt, type }) {
        return new Promise((resolve, reject) => {
            db.run("INSERT INTO Users (username, name, password, salt, type) VALUES (?, ?, ?, ?, ?)", [username, name, password, salt, type], function(err) {
                if (err) return reject(err);
                resolve(this.lastID); 
            });
        });
    },

    getUserByUsername(username, password) {
        if (password === undefined) {
            return new Promise((resolve, reject) => {
                db.get("SELECT * FROM Users WHERE username = ?", [username], (err, row) => {
                    if (err) return reject(err);
                    resolve(row);
                });
            });
        }
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM Users WHERE username = ?", [username], async (err, row) => {
                if (err) return reject(err);
                if (!row) return resolve(false); // User not found

                // Verify password with bcrypt
                const match = await bcrypt.compare(password, row.password);
                if (!match) {
                    return resolve(false); // Incorrect password
                }
                resolve({
                    id: row.id,
                    username: row.username,
                    name: row.name,
                    type: row.type,
                    game: row.game
                });
            });
        });
    },

    getUserByName(name) {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM Users WHERE name = ?", [name], (err, row) => {
                if (err) return reject(err);
                if (!row) return resolve(null);
                resolve(new User(row.id, row.name, row.username, row.type, row.game));
            });
        });
    },

    // ARTICLES
    getArticleById(articleId) {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM Articles WHERE id = ?", [articleId], (err, row) => {
                if (err) return reject(err);
                if (!row) return resolve(null);
                resolve(row);
            });
        });
    },

    async getAllArticles() {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM Articles", [], async (err, rows) => {
                if (err) return reject(err);
                const articles = await Promise.all(rows.map(async (row) => {
                    let authorName = "";
                    let authorNickname = "";
                    
                    // Recupera i dati dell'autore direttamente tramite author_id
                    if (row.author) {
                        const authorData = await new Promise((res, rej) => {
                            db.get("SELECT user, nickname FROM Authors WHERE id = ?", [row.author], (err, authorRow) => {
                                if (err) return res({ user: null, nickname: "" });
                                res(authorRow ? { user: authorRow.user, nickname: authorRow.nickname } : { user: null, nickname: "" });
                            });
                        });
                        
                        authorNickname = authorData.nickname || "";
                        
                        // Recupera il nome dell'utente
                        if (authorData.user) {
                            const userData = await new Promise((res, rej) => {
                                db.get("SELECT name FROM Users WHERE id = ?", [authorData.user], (err, userRow) => {
                                    if (err) return res({ name: "" });
                                    res(userRow ? { name: userRow.name } : { name: "" });
                                });
                            });
                            authorName = userData.name;
                        }
                    }
                    
                    let categoryName = "";
                    if (row.category) {
                        categoryName = await getCategoryNameById(row.category);
                    }
                    return new Article(
                        row.id,
                        authorName,
                        row.date,
                        row.title,
                        row.extract,
                        row.text,
                        categoryName,
                        row.visuals,
                        row.likes,
                        row.comments,
                        authorNickname
                    );
                }));
                resolve(articles);
            });
        });
    },

    async getArticlesByUser(userId) {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM Articles WHERE user = ?", [userId], async (err, rows) => {
                if (err) return reject(err);
                const articles = await Promise.all(rows.map(async (row) => {
                    let authorName = "";
                    let authorNickname = "";
                    
                    // Recupera i dati dell'autore direttamente tramite author_id
                    if (row.author) {
                        const authorData = await new Promise((res, rej) => {
                            db.get("SELECT user, nickname FROM Authors WHERE id = ?", [row.author], (err, authorRow) => {
                                if (err) return res({ user: null, nickname: "" });
                                res(authorRow ? { user: authorRow.user, nickname: authorRow.nickname } : { user: null, nickname: "" });
                            });
                        });
                        
                        authorNickname = authorData.nickname || "";
                        
                        // Recupera il nome dell'utente
                        if (authorData.user) {
                            const userData = await new Promise((res, rej) => {
                                db.get("SELECT name FROM Users WHERE id = ?", [authorData.user], (err, userRow) => {
                                    if (err) return res({ name: "" });
                                    res(userRow ? { name: userRow.name } : { name: "" });
                                });
                            });
                            authorName = userData.name;
                        }
                    }
                    
                    let categoryName = "";
                    if (row.category) {
                        categoryName = await getCategoryNameById(row.category);
                    }
                    return new Article(
                        row.id,
                        authorName,
                        row.date,
                        row.title,
                        row.extract,
                        row.text,
                        categoryName,
                        row.visuals,
                        row.likes,
                        row.comments,
                        authorNickname
                    );
                }));
                resolve(articles);
            });
        });
    },

    async getArticlesByAuthorId(authorId) {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM Articles WHERE author = ?", [authorId], async (err, rows) => {
                if (err) return reject(err);
                const articles = await Promise.all(rows.map(async (row) => {
                    let authorName = "";
                    let authorNickname = "";
                    
                    // Recupera i dati dell'autore direttamente tramite author_id
                    if (row.author) {
                        const authorData = await new Promise((res, rej) => {
                            db.get("SELECT user, nickname FROM Authors WHERE id = ?", [row.author], (err, authorRow) => {
                                if (err) return res({ user: null, nickname: "" });
                                res(authorRow ? { user: authorRow.user, nickname: authorRow.nickname } : { user: null, nickname: "" });
                            });
                        });
                        
                        authorNickname = authorData.nickname || "";
                        
                        // Recupera il nome dell'utente
                        if (authorData.user) {
                            const userData = await new Promise((res, rej) => {
                                db.get("SELECT name FROM Users WHERE id = ?", [authorData.user], (err, userRow) => {
                                    if (err) return res({ name: "" });
                                    res(userRow ? { name: userRow.name } : { name: "" });
                                });
                            });
                            authorName = userData.name;
                        }
                    }
                    
                    let categoryName = "";
                    if (row.category) {
                        categoryName = await getCategoryNameById(row.category);
                    }
                    return new Article(
                        row.id,
                        authorName,
                        row.date,
                        row.title,
                        row.extract,
                        row.text,
                        categoryName,
                        row.visuals,
                        row.likes,
                        row.comments,
                        authorNickname
                    );
                }));
                resolve(articles);
            });
        });
    },

    createArticle({ user, author, title, extract, text, category, date }) {
        return new Promise((resolve, reject) => {
            db.run(
                "INSERT INTO Articles (user, author, title, extract, text, category, date, visuals, likes, comments) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, 0)",
                [user, author, title, extract, text, category, date],
                function(err) {
                    if (err) return reject(err);
                    db.get("SELECT * FROM Articles WHERE id = ?", [this.lastID], async (err, row) => {
                        if (err) return reject(err);
                        
                        let authorName = "";
                        let authorNickname = "";
                        
                        // Recupera i dati dell'autore
                        if (row.author) {
                            const authorData = await new Promise((res, rej) => {
                                db.get("SELECT user, nickname FROM Authors WHERE id = ?", [row.author], (err, authorRow) => {
                                    if (err) return res({ user: null, nickname: "" });
                                    res(authorRow ? { user: authorRow.user, nickname: authorRow.nickname } : { user: null, nickname: "" });
                                });
                            });
                            
                            authorNickname = authorData.nickname || "";
                            
                            // Recupera il nome dell'utente
                            if (authorData.user) {
                                const userData = await new Promise((res, rej) => {
                                    db.get("SELECT name FROM Users WHERE id = ?", [authorData.user], (err, userRow) => {
                                        if (err) return res({ name: "" });
                                        res(userRow ? { name: userRow.name } : { name: "" });
                                    });
                                });
                                authorName = userData.name;
                            }
                        }
                        
                        let categoryName = "";
                        if (row.category) {
                            categoryName = await getCategoryNameById(row.category);
                        }
                        resolve(new Article(
                            row.id,
                            authorName,
                            row.date,
                            row.title,
                            row.extract,
                            row.text,
                            categoryName,
                            row.visuals,
                            row.likes,
                            row.comments,
                            authorNickname
                        ));
                    });
                }
            );
        });
    },

    incrementArticleVisuals(articleId) {
        return new Promise((resolve, reject) => {
            db.run(
                "UPDATE Articles SET visuals = visuals + 1 WHERE id = ?",
                [articleId],
                function(err) {
                    if (err) return reject(err);
                    resolve();
                }
            );
        });
    },

    updateArticle(articleId, { title, extract, text, category }) {
        return new Promise((resolve, reject) => {
            db.run(
                "UPDATE Articles SET title = ?, extract = ?, text = ?, category = ? WHERE id = ?",
                [title, extract, text, category, articleId],
                function(err) {
                    if (err) return reject(err);
                    resolve({ id: articleId, title, extract, text, category });
                }
            );
        });
    },

    incrementArticleLikes(articleId) {
        return new Promise((resolve, reject) => {
            db.run(
                "UPDATE Articles SET likes = likes + 1 WHERE id = ?",
                [articleId],
                function(err) {
                    if (err) return reject(err);
                    resolve();
                }
            );
        });
    },

    createLikeEntry(articleId, userId) {
        return new Promise((resolve, reject) => {
            db.run(
                "INSERT INTO Likes (article, user) VALUES (?, ?)",
                [articleId, userId],
                function(err) {
                    if (err) return reject(err);
                    resolve(this.lastID);
                }
            );
        });
    },

    getAllCategories() {
        return new Promise((resolve, reject) => {
            db.all("SELECT id, name FROM Categories", [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },

    // AUTHORS
    getAuthorByUserId(userId) {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM Authors WHERE user = ?", [userId], (err, row) => {
                if (err) return reject(err);
                if (!row) return resolve(null);
                resolve(new Author(row.id, row.user, row.age, row.nickname, row.insta, row.email, row.presentation));
            });
        });
    },

    getAuthorById(authorId) {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM Authors WHERE id = ?", [authorId], (err, row) => {
                if (err) return reject(err);
                if (!row) return resolve(null);
                resolve(new Author(row.id, row.user, row.age, row.nickname, row.insta, row.email, row.presentation));
            });
        });
    },

    getAllAuthors() {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM Authors", [], (err, rows) => {
                if (err) return reject(err);
                const authors = rows.map(row => new Author(row.id, row.user, row.age, row.nickname, row.insta, row.email, row.presentation));
                resolve(authors);
            });
        });
    },

    createAuthor({ user, age, nickname, insta, email, presentation }) {
        return new Promise((resolve, reject) => {
            db.run(
                "INSERT INTO Authors (user, age, nickname, insta, email, presentation) VALUES (?, ?, ?, ?, ?, ?)",
                [user, age, nickname, insta, email, presentation],
                function(err) {
                    if (err) {
                        if (err.message && err.message.includes('UNIQUE constraint failed')) {
                            return reject(new Error('Autore per questo utente già esistente'));
                        }
                        return reject(err);
                    }
                    db.get("SELECT * FROM Authors WHERE id = ?", [this.lastID], (err, row) => {
                        if (err) return reject(err);
                        resolve(new Author(row.id, row.user, row.age, row.nickname, row.insta, row.email, row.presentation));
                    });
                }
            );
        });
    },

    updateAuthor({ id, age, nickname, insta, email, presentation }) {
        return new Promise((resolve, reject) => {
            db.run(
                "UPDATE Authors SET age = ?, nickname = ?, insta = ?, email = ?, presentation = ? WHERE id = ?",
                [age, nickname, insta, email, presentation, id],
                function(err) {
                    if (err) return reject(err);
                    if (this.changes === 0) return reject(new Error('Autore non trovato'));
                    db.get("SELECT * FROM Authors WHERE id = ?", [id], (err, row) => {
                        if (err) return reject(err);
                        resolve(new Author(row.id, row.user, row.age, row.nickname, row.insta, row.email, row.presentation));
                    });
                }
            );
        });
    },

    deleteAuthor(authorId) {
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM Authors WHERE id = ?", [authorId], function(err) {
                if (err) return reject(err);
                if (this.changes === 0) return reject(new Error('Autore non trovato'));
                resolve();
            });
        });
    },

    // FAVOURITES
    addToFavourites(userId, articleId) {
        return new Promise((resolve, reject) => {
            db.run(
                "INSERT INTO Favourites (user, article) VALUES (?, ?)",
                [userId, articleId],
                function(err) {
                    if (err) {
                        if (err.message.includes('UNIQUE constraint failed')) {
                            return reject(new Error('Articolo già nei preferiti'));
                        }
                        return reject(err);
                    }
                    resolve(this.lastID);
                }
            );
        });
    },

    removeFromFavourites(userId, articleId) {
        return new Promise((resolve, reject) => {
            db.run(
                "DELETE FROM Favourites WHERE user = ? AND article = ?",
                [userId, articleId],
                function(err) {
                    if (err) return reject(err);
                    if (this.changes === 0) {
                        return reject(new Error('Articolo non trovato nei preferiti'));
                    }
                    resolve();
                }
            );
        });
    },

    getFavouritesByUser(userId) {
        return new Promise((resolve, reject) => {
            db.all(
                "SELECT * FROM Articles WHERE id IN (SELECT article FROM Favourites WHERE user = ?)",
                [userId],
                async (err, rows) => {
                    if (err) return reject(err);
                    const articles = await Promise.all(rows.map(async (row) => {
                        let authorName = "";
                        let authorNickname = "";
                        
                        // Recupera i dati dell'autore direttamente tramite author_id
                        if (row.author) {
                            const authorData = await new Promise((res, rej) => {
                                db.get("SELECT user, nickname FROM Authors WHERE id = ?", [row.author], (err, authorRow) => {
                                    if (err) return res({ user: null, nickname: "" });
                                    res(authorRow ? { user: authorRow.user, nickname: authorRow.nickname } : { user: null, nickname: "" });
                                });
                            });
                            
                            authorNickname = authorData.nickname || "";
                            
                            // Recupera il nome dell'utente
                            if (authorData.user) {
                                const userData = await new Promise((res, rej) => {
                                    db.get("SELECT name FROM Users WHERE id = ?", [authorData.user], (err, userRow) => {
                                        if (err) return res({ name: "" });
                                        res(userRow ? { name: userRow.name } : { name: "" });
                                    });
                                });
                                authorName = userData.name;
                            }
                        }
                        
                        let categoryName = "";
                        if (row.category) {
                            categoryName = await getCategoryNameById(row.category);
                        }
                        return new Article(
                            row.id,
                            authorName,
                            row.date,
                            row.title,
                            row.extract,
                            row.text,
                            categoryName,
                            row.visuals,
                            row.likes,
                            row.comments,
                            authorNickname
                        );
                    }));
                    resolve(articles);
                }
            );
        });
    },

    isFavourite(userId, articleId) {
        return new Promise((resolve, reject) => {
            db.get(
                "SELECT * FROM Favourites WHERE user = ? AND article = ?",
                [userId, articleId],
                (err, row) => {
                    if (err) return reject(err);
                    resolve(!!row);
                }
            );
        });
    }
};

export default DAO;
