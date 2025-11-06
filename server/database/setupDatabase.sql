CREATE TABLE "Users" (
	"id"	INTEGER,
	"username"	TEXT NOT NULL,
	"password"	TEXT NOT NULL,
	"salt"	TEXT NOT NULL,
	"email"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE "Cards" (
	"id"	INTEGER,
	"title"	TEXT NOT NULL,
	"image_path"	TEXT NOT NULL,
	"bad_luck_value"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE Games (
	"id"	INTEGER,
	"user_id"	INTEGER NOT NULL,
	"created_at"	DATETIME NOT NULL,
	"result"	TEXT CHECK("result" IN ('win', 'lose')),
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("user_id") REFERENCES Users("id") ON DELETE CASCADE
);

CREATE TABLE "Rounds" (
	"id"	INTEGER,
	"game_id"	INTEGER NOT NULL,
	"card_id"	INTEGER NOT NULL,
	"round_number"	INTEGER NOT NULL CHECK("round_number" >= 0),
	"result"	TEXT CHECK("result" IN ('correct', 'wrong', 'timeout') OR "result" IS NULL),
	"created_at"	DATETIME,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("card_id") REFERENCES "Cards"("id") ON DELETE CASCADE,
	FOREIGN KEY("game_id") REFERENCES "Games"("id") ON DELETE CASCADE
);

CREATE TABLE "Favourites" (
	"id"	INTEGER,
	"user"	INTEGER NOT NULL,
	"article"	INTEGER NOT NULL,
	"created_at"	DATETIME DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("user") REFERENCES "Users"("id") ON DELETE CASCADE,
	FOREIGN KEY("article") REFERENCES "Articles"("id") ON DELETE CASCADE,
	UNIQUE("user", "article")
);



