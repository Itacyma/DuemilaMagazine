import dayjs from 'dayjs';

function User(id, name, username, type, game) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.type = type;
    this.game = game;
}

function Article(id, author, date, title, extract, text, category, visuals, likes, comments, nickname) {
    this.id = id;
    this.author = author; // User ID (owner)
    this.date = dayjs(date);
    this.title = title;
    this.extract = extract;
    this.text = text;
    this.category = category;
    this.visuals = visuals;
    this.likes = likes;
    this.comments = comments;
    this.nickname = nickname; // Author nickname
}

function Author(id, user, age, nickname, insta, email, presentation) {
    this.id = id;
    this.user = user;
    this.age = age;
    this.nickname = nickname;
    this.insta = insta;
    this.email = email;
    this.presentation = presentation;
}


export { User, Article, Author };