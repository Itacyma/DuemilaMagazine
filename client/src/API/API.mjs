import { User, Article, Author } from "../models/models.mjs";
import dayjs from "dayjs";

const SERVER_URL = "http://localhost:3001";


// AUTHENTICATION

export const login = async (credentials) => {
    const response = await fetch(`${SERVER_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error (data.error);
    }
    return new User(data.id, data.name, data.username, data.type, data.game);
}

export const getUserInfo = async () => {
    const response = await fetch(`${SERVER_URL}/api/login/current`, {
        method: 'GET',
        credentials: 'include'
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error (data.error);
    }
    return new User(data.id, data.name, data.username, data.type, data.game);
}

export const logOut = async() => {
    const response = await fetch(SERVER_URL + '/api/login/current', {
        method: 'DELETE',
        credentials: 'include'
    });
    if (!response.ok) {
        throw new Error("Errore nel logout");
    }
}

export const register = async (userData) => {
    const response = await fetch(SERVER_URL + '/api/register', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Errore nella registrazione");
    }
    return data;
}

export const getPublicArticles = async () => {
    const response = await fetch(`${SERVER_URL}/api/articles/public`);
    if (!response.ok) throw new Error("Errore nel recupero articoli pubblici");
    const articles = await response.json();
    return articles.map(a =>
        new Article(
            a.id,
            a.author,
            a.date,
            a.title,
            a.extract,
            a.text,
            a.category,
            a.visuals,
            a.likes,
            a.comments,
            a.nickname
        )
    );
}

export const getPrivateArticles = async () => {
    const response = await fetch(`${SERVER_URL}/api/articles/private`, {
        credentials: "include"
    });
    if (!response.ok) throw new Error("Errore nel recupero dei tuoi articoli");
    const articles = await response.json();
    return articles.map(a =>
        new Article(
            a.id,
            a.author,
            a.date,
            a.title,
            a.extract,
            a.text,
            a.category,
            a.visuals,
            a.likes,
            a.comments,
            a.nickname
        )
    );
}

export const getOwnArticles = async () => {
    const response = await fetch(`${SERVER_URL}/api/articles/own`, {
        credentials: "include"
    });
    if (!response.ok) throw new Error("Errore nel recupero dei tuoi articoli");
    const articles = await response.json();
    return articles.map(a =>
        new Article(
            a.id,
            a.author,
            a.date,
            a.title,
            a.extract,
            a.text,
            a.category,
            a.visuals,
            a.likes,
            a.comments,
            a.nickname
        )
    );
}

export async function createArticle(article) {
    const response = await fetch(`${SERVER_URL}/api/articles/own/new`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(article)
    });
    if (!response.ok) {
        throw new Error("Errore nella creazione dell'articolo");
    }
    return await response.json();
}

export async function updateArticle(articleId, articleData) {
    const response = await fetch(`${SERVER_URL}/api/articles/${articleId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(articleData)
    });
    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Errore nell'aggiornamento dell'articolo");
    }
    return await response.json();
}

export async function incrementArticleVisuals(articleId) {
    await fetch(`${SERVER_URL}/api/articles/${articleId}/visuals`, {
        method: "POST",
        credentials: "include"
    });
}

export async function incrementArticleLikes(articleId) {
    await fetch(`${SERVER_URL}/api/articles/${articleId}/likes`, {
        method: "POST",
        credentials: "include"
    });
}

export async function getCategories() {
    const response = await fetch(`${SERVER_URL}/api/categories`);
    if (!response.ok) throw new Error("Errore nel recupero delle categorie");
    return await response.json();
}

// FAVOURITES

export async function changeFavourite(articleId) {
    const response = await fetch(`${SERVER_URL}/api/favourites/${articleId}`, {
        method: "POST",
        credentials: "include"
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Errore nell'aggiunta o rimozione dai preferiti");
    }
    return data;
}

export async function getFavourites() {
    const response = await fetch(`${SERVER_URL}/api/favourites`, {
        credentials: "include"
    });
    if (!response.ok) throw new Error("Errore nel recupero dei preferiti");
    const articles = await response.json();
    return articles.map(a =>
        new Article(
            a.id,
            a.author,
            a.date,
            a.title,
            a.extract,
            a.text,
            a.category,
            a.visuals,
            a.likes,
            a.comments,
            a.nickname
        )
    );
}

export async function isFavourite(articleId) {
    const response = await fetch(`${SERVER_URL}/api/favourites/${articleId}/check`, {
        credentials: "include"
    });
    if (!response.ok) throw new Error("Errore nel controllo preferiti");
    const data = await response.json();
    return data.isFavourite;
}

export async function checkArticleOwnership(articleId) {
    const response = await fetch(`${SERVER_URL}/api/articles/${articleId}/ownership`, {
        credentials: "include"
    });
    if (!response.ok) throw new Error("Errore nella verifica del proprietario");
    const data = await response.json();
    return data.isOwner;
}

// AUTHORS (client API)
export async function getAllAuthors() {
    const response = await fetch(`${SERVER_URL}/api/authors`);
    if (!response.ok) throw new Error('Errore nel recupero degli autori');
    const authors = await response.json();
    return authors.map(a => new Author(a.id, a.user, a.age, a.nickname, a.insta, a.email, a.presentation));
}

export async function getAuthorById(authorId) {
    const response = await fetch(`${SERVER_URL}/api/authors/${authorId}`);
    if (!response.ok) throw new Error('Errore nel recupero dell\'autore');
    const a = await response.json();
    return new Author(a.id, a.user, a.age, a.nickname, a.insta, a.email, a.presentation);
}

export async function getAuthorByUserId(userId) {
    const response = await fetch(`${SERVER_URL}/api/authors/user/${userId}`);
    if (!response.ok) throw new Error('Errore nel recupero dell\'autore per utente');
    const a = await response.json();
    return new Author(a.id, a.user, a.age, a.nickname, a.insta, a.email, a.presentation);
}

export async function getMyAuthor() {
    const response = await fetch(`${SERVER_URL}/api/authors/me`, {
        credentials: 'include'
    });
    if (!response.ok) throw new Error('Errore nel recupero del tuo profilo autore');
    const a = await response.json();
    return new Author(a.id, a.user, a.age, a.nickname, a.insta, a.email, a.presentation);
}

export async function createAuthor(authorData) {
    const response = await fetch(`${SERVER_URL}/api/authors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(authorData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Errore nella creazione del profilo autore');
    return new Author(data.id, data.user, data.age, data.nickname, data.insta, data.email, data.presentation);
}

export async function updateAuthor(id, authorData) {
    const response = await fetch(`${SERVER_URL}/api/authors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(authorData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Errore nell\'aggiornamento del profilo autore');
    return new Author(data.id, data.user, data.age, data.nickname, data.insta, data.email, data.presentation);
}

export async function deleteAuthor(id) {
    const response = await fetch(`${SERVER_URL}/api/authors/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Errore nella cancellazione del profilo autore');
    }
}

export async function getArticlesByAuthorId(authorId) {
    const response = await fetch(`${SERVER_URL}/api/articles/author/${authorId}`);
    if (!response.ok) throw new Error('Errore nel recupero articoli dell\'autore');
    const articles = await response.json();
    return articles.map(a =>
        new Article(
            a.id,
            a.author,
            a.date,
            a.title,
            a.extract,
            a.text,
            a.category,
            a.visuals,
            a.likes,
            a.comments,
            a.nickname
        )
    );
}



