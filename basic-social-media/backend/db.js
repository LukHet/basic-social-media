"use server";

import sqlite from "better-sqlite3";

const db = sqlite("data.db");

function initDb() {
  db.prepare(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, password TEXT, name TEXT, surname TEXT, birthdate DATE, gender TEXT, city TEXT, country TEXT)"
  ).run();

  db.prepare(
    "CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, content TEXT, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)"
  ).run();

  db.prepare(
    "CREATE TABLE IF NOT EXISTS sessions (id TEXT NOT NULL PRIMARY KEY, expires_at INTEGER NOT NULL, user_id INTEGER NOT NULL, FOREIGN KEY (user_id) REFERENCES users(id))"
  ).run();
}

initDb();

export default db;
