import dayjs from 'dayjs';

function User(id, name, username, type, game) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.type = type;
    this.game = game;
}

function Article(id, author, date, title, extract, text, category, categoryId, visuals, likes, comments, nickname) {
    this.id = id;
    this.author = author; // User ID (owner)
    this.date = dayjs(date);
    this.title = title;
    this.extract = extract;
    this.text = text;
    this.category = category; // Category name
    this.categoryId = categoryId; // Category ID
    this.visuals = visuals;
    this.likes = likes;
    this.comments = comments;
    this.nickname = nickname; // Author nickname
}

function Author(id, user, age, nickname, insta, email, presentation, profile_photo) {
    this.id = id;
    this.user = user;
    this.age = age;
    this.nickname = nickname;
    this.insta = insta;
    this.email = email;
    this.presentation = presentation;
    this.profile_photo = profile_photo;
}

function Event(id, title, category, date, location, address, extract, description, capacity, status, photo) {
    this.id = id;
    this.title = title;
    this.category = category;
    this.date = dayjs(date);
    this.location = location;
    this.address = address;
    this.extract = extract;
    this.description = description;
    this.capacity = capacity;
    this.status = status;
    this.photo = photo;
}

export { User, Article, Author, Event };