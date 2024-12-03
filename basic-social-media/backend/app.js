import express from "express";
import sqlite from "better-sqlite3";
import cors from "cors";

const db = sqlite("data.db");

function initDb() {
  db.prepare(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT UNIQUE, password TEXT)"
  ).run();
}

const app = express();

app.use(cors());

app.get("/users", (req, res) => {
  const news = db.prepare("SELECT * FROM users").all();
  res.json(news);
});

initDb();

app.listen(8080);
