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
    .prepare(
      "SELECT email, name, surname, birthdate, gender, city, country FROM users WHERE id = ?"
    )
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

  const foundUser = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
  const userName = `${foundUser.name} ${foundUser.surname}`;
  try {
    const createdPost = db
      .prepare(
        "INSERT INTO posts (user_id, content, post_date, author) VALUES (?, ?, ?, ?)"
      )
      .run(foundUserId, postContent, post_date, userName);

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

app.get("/user-posts", verifySession, async (req, res) => {
  const { userId } = req;
  const posts = db.prepare("SELECT * from posts WHERE user_id = ?").all(userId);
  return res.status(200).json(posts);
});

app.get("/other-user-posts", verifySession, async (req, res) => {
  const { otherUserId } = req.query;
  const posts = db
    .prepare("SELECT * from posts WHERE user_id = ?")
    .all(otherUserId);
  return res.status(200).json(posts);
});

app.get("/get-likes", verifySession, async (req, res) => {
  const { postId } = req.query;
  try {
    const likes = db
      .prepare("SELECT * from likes WHERE post_id = ?")
      .all(postId);
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(404).jsonjson({ message: "Couldn't get likes: ", err });
  }
});

app.get("/get-comments", verifySession, async (req, res) => {
  const { postId } = req.query;
  try {
    const comments = db
      .prepare("SELECT * from comments WHERE post_id = ?")
      .all(postId);
    return res.status(200).json(comments);
  } catch (err) {
    return res
      .status(404)
      .jsonjson({ message: "Couldn't find the comments: ", err });
  }
});

app.post("/post-like", async (req, res) => {
  const { postId } = req.body;
  const { userId } = req;
  try {
    const foundUserData = db
      .prepare("SELECT name, surname FROM users WHERE id = ?")
      .get(userId);

    const author = foundUserData.name + " " + foundUserData.surname;

    const postLiked = db
      .prepare("INSERT INTO likes (user_id, post_id, author) VALUES (?, ?, ?)")
      .run(userId, postId, author);

    return res.status(200).json({ message: "Post has been liked!" });
  } catch (err) {
    return res
      .status(404)
      .jsonjson({ message: "Couldn't like the post: ", err });
  }
});

app.post("/post-comment", verifySession, async (req, res) => {
  const { postId, content, comment_date } = req.body;
  const { userId } = req;
  console.log(postId, content, userId);
  try {
    const foundUserData = db
      .prepare("SELECT name, surname FROM users WHERE id = ?")
      .get(userId);

    const author = foundUserData.name + " " + foundUserData.surname;

    const postCommented = db
      .prepare(
        "INSERT INTO comments (user_id, post_id, content, author, comment_date) VALUES (?, ?, ?, ?, ?)"
      )
      .run(userId, postId, content, author, comment_date);

    return res.status(200).json({ message: "Post has been commented!" });
  } catch (err) {
    return res
      .status(404)
      .json({ message: "Couldn't post the comment: ", err });
  }
});

app.get("/other-user-data", verifySession, async (req, res) => {
  const { otherUserId } = req.query;
  const foundUserData = db
    .prepare(
      "SELECT email, name, surname, birthdate, gender, city, country FROM users WHERE id = ?"
    )
    .get(otherUserId);
  return res.status(200).json(foundUserData);
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

app.post("/update-user-data", verifySession, async (req, res) => {
  const { name, surname, email, birthdate, gender, country, city } = req.body;
  const { userId } = req;

  try {
    const update = db
      .prepare(
        "UPDATE users SET name = ?, surname = ?, email = ?, birthdate = ?, gender = ?, country = ?, city = ? WHERE id = ?"
      )
      .run(name, surname, email, birthdate, gender, country, city, userId);
    console.log(update);
    res.status(200).json({ message: "User data has been updated" });
  } catch (err) {
    res.status(500).json({ message: "Couldn't update the user data" });
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
