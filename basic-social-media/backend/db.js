"use server";

import sqlite from "better-sqlite3";

const db = sqlite("data.db");

function initDb() {
  db.prepare(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, password TEXT, name TEXT, surname TEXT, birthdate DATE, gender TEXT, city TEXT, country TEXT)"
  ).run();

  db.prepare(
    "CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, post_date DATE, content TEXT, author TEXT, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)"
  ).run();

  db.prepare(
    "CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, comment_date DATE, post_id INTEGER NOT NULL, content TEXT, author TEXT, FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)"
  ).run();

  db.prepare(
    "CREATE TABLE IF NOT EXISTS likes (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, post_id INTEGER NOT NULL, author TEXT, FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)"
  ).run();

  db.prepare(
    "CREATE TABLE IF NOT EXISTS sessions (id TEXT NOT NULL PRIMARY KEY, expires_at INTEGER NOT NULL, user_id INTEGER NOT NULL, FOREIGN KEY (user_id) REFERENCES users(id))"
  ).run();

  db.prepare(
    "CREATE TABLE IF NOT EXISTS messages (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, receiver_id INTEGER NOT NULL, sender_id INTEGER NOT NULL, content TEXT, message_date DATE, FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE)"
  ).run();
}

initDb();

export default db;
