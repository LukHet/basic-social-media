import express from "express";
import sqlite from "better-sqlite3";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

const db = sqlite("data.db");

function initDb() {
  db.prepare(
    "CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE, password TEXT)"
  ).run();
}

const app = express();

app.use(cors());
app.use(express.json());

app.get("/users", (req, res) => {
  const news = db.prepare("SELECT * FROM users").all();
  res.json(news);
});

app.post("/user-register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const userId = uuidv4();

  try {
    db.prepare("INSERT INTO users (id, email, password) VALUES (?, ?, ?)").run(
      userId,
      email,
      password
    );
    res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Couldn't register the user", err });
  }
});

initDb();

app.listen(8080);
