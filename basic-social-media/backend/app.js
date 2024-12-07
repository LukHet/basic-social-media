import express from "express";
import sqlite from "better-sqlite3";
import cors from "cors";
import bcrypt from "bcrypt";

const db = sqlite("data.db");

function initDb() {
  db.prepare(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT UNIQUE, password TEXT)"
  ).run();

  db.prepare(
    "CREATE TABLE IF NOT EXISTS sessions (id TEXT NOT NULL PRIMARY KEY, expires_at INTEGER NOT NULL, user_id TEXT NOT NULL, FOREIGN KEY (user_id) REFERENCES users(id))"
  ).run();
}

const app = express();

app.use(cors());
app.use(express.json());

app.get("/users", (req, res) => {
  const news = db.prepare("SELECT * FROM users").all();
  res.json(news);
});

app.post("/user-register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const saltRounds = 10;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    db.prepare("INSERT INTO users (email, password) VALUES (?, ?)").run(
      email,
      hashedPassword
    );
    res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Couldn't register the user. ", err });
  }
});

app.post("/user-login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const saltRounds = 10;

  try {
    const foundUser = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email);

    const comparePasswordsResult = await bcrypt.compare(
      password,
      foundUser.password
    );
    if (comparePasswordsResult) {
      res.status(200).json({ message: "User found" });
    } else {
      res.status(401).json({ message: "Email or password is incorrect" });
    }
  } catch (err) {
    res.status(500).json({ message: "Couldn't find the user", err });
  }
});

initDb();

app.listen(8080);

export default db;
