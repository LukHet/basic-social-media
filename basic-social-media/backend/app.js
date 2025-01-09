"use server";

import "./setupCrypto.js";
import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import cookieParser from "cookie-parser";
import db from "./db.js";
import { createAuthSession, verifySession, deleteAuthSession } from "./auth.js";

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get("/user-data", (req, res) => {
  const authSessionFound = req.cookies.auth_session;
  const foundSession = db
    .prepare("SELECT * FROM sessions WHERE id = ?")
    .get(authSessionFound);
  const foundUserId = parseInt(foundSession?.user_id);
  const foundUserData = db
    .prepare("SELECT * FROM users WHERE id = ?")
    .get(foundUserId);
  res.json(foundUserData);
});

app.get("/verify-user", verifySession, (req, res) => {
  res
    .status(200)
    .json({ message: "Welcome to the main page", userId: req.userId });
});

app.get("/user-logout", async (req, res) => {
  const authSessionFound = req.cookies.auth_session;

  const foundUser = db
    .prepare("SELECT * FROM sessions WHERE id = ?")
    .get(authSessionFound);

  if (!foundUser) {
    return res.status(404).send("Session not found");
  }

  try {
    await deleteAuthSession(res, foundUser.user_id);
    res.send("Logged out successfully!");
  } catch (error) {
    res.status(500).send("Failed to log out");
  }
});

app.post("/user-post", verifySession, async (req, res) => {
  const { content, post_date } = req.body;
  const { userId } = req;

  const postContent = content;
  const foundUserId = userId;
  try {
    const createdPost = db
      .prepare(
        "INSERT INTO posts (user_id, content, post_date) VALUES (?, ?, ?)"
      )
      .run(foundUserId, postContent, post_date);

    return res.status(200).json({ message: "Post published successfully!" });
  } catch (err) {
    return res
      .status(400)
      .json({ message: "There was an error during publishing post" });
  }
});

app.get("/posts", verifySession, async (req, res) => {
  const posts = db.prepare("SELECT * from posts").all();
  return res.status(200).json(posts);
});

app.post("/user-register", async (req, res) => {
  const { name, surname, email, password, birthdate, gender, country, city } =
    req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const saltRounds = 10;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const createdUser = db
      .prepare(
        "INSERT INTO users (name, surname, email, password, birthdate, gender, country, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      )
      .run(
        name,
        surname,
        email,
        hashedPassword,
        birthdate,
        gender,
        country,
        city
      );

    await createAuthSession(res, createdUser.lastInsertRowid);
    res.status(200).json({ message: "User created successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Couldn't register the user.", err });
  }
});

app.post("/user-login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const foundUser = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email);

    const comparePasswordsResult = await bcrypt.compare(
      password,
      foundUser.password
    );
    if (comparePasswordsResult) {
      await createAuthSession(res, foundUser.id);
      res.status(200).json({ message: "User found and logged in" });
    } else {
      res.status(401).json({ message: "Email or password is incorrect" });
    }
  } catch (err) {
    res.status(500).json({ message: "Couldn't find the user", err });
  }
});

app.listen(8080);

export default db;
