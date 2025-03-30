"use server";

import "./setupCrypto.js";
import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "node:http";
import db from "./db.js";
import { createAuthSession, verifySession, deleteAuthSession } from "./auth.js";
import { Server } from "socket.io";
import {
  LOCALHOST_URL,
  TEST_LOCALHOST_URL,
  MAX_STRING_LENGTH,
  EMAIL_REGEX,
  MAX_COMMENT_LENGTH,
} from "../constants/app-info.js";

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [LOCALHOST_URL, TEST_LOCALHOST_URL];

    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: corsOptions });

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

io.on("connection", (socket) => {
  socket.on("send", (value) => {
    console.log("message has been sent", value);
    socket.broadcast.emit("receive", value);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

const PORT = process.env.PORT || 8081;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/user-data", (req, res) => {
  const authSessionFound = req.cookies.auth_session;
  const foundSession = db
    .prepare("SELECT * FROM sessions WHERE id = ?")
    .get(authSessionFound);
  const foundUserId = parseInt(foundSession?.user_id);
  const foundUserData = db
    .prepare(
      "SELECT email, name, surname, birthdate, gender, city, country, id FROM users WHERE id = ?"
    )
    .get(foundUserId);
  res.json(foundUserData);
});

app.get("/user-id", (req, res) => {
  const authSessionFound = req.cookies.auth_session;
  const foundSession = db
    .prepare("SELECT * FROM sessions WHERE id = ?")
    .get(authSessionFound);
  const foundUserId = parseInt(foundSession?.user_id);
  res.json(foundUserId);
});

app.get("/verify-user", verifySession, (req, res) => {
  res
    .status(200)
    .json({ message: "Welcome to the main page", userId: req.userId });
});

app.get("/all-users", verifySession, (req, res) => {
  const { userId } = req;
  try {
    const allUsers = db
      .prepare("SELECT name, surname, id FROM users WHERE NOT id = ?")
      .all(userId);
    res.status(200).json(allUsers);
  } catch (err) {
    res.status(404).send("Couldn't get users");
  }
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

  if (content.length === 0 || content.length > MAX_STRING_LENGTH) {
    return res
      .status(400)
      .json({ message: "Provided post content has incorrect length" });
  }

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
    return res.status(200).json(likes);
  } catch (err) {
    return res.status(404).json({ message: "Couldn't get likes: ", err });
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
      .json({ message: "Couldn't find the comments: ", err });
  }
});

app.get("/search-users", verifySession, async (req, res) => {
  const { searchValue } = req.query;

  try {
    const foundUsers = db
      .prepare("SELECT * FROM users WHERE name LIKE ? OR surname LIKE ?")
      .all([`%${searchValue}%`, `%${searchValue}%`]);

    res.status(200).json(foundUsers);
  } catch (err) {
    res.status(404).json({ message: "Couldn't find the users: ", err });
  }
});

app.post("/post-like", verifySession, async (req, res) => {
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
    return res.status(404).json({ message: "Couldn't like the post: ", err });
  }
});

app.post("/delete-like", verifySession, async (req, res) => {
  const { postId } = req.body;
  const { userId } = req;
  try {
    const deleteLiked = db
      .prepare("DELETE FROM likes WHERE user_id=? AND post_id=?")
      .run(userId, postId);

    return res.status(200).json({ message: "Post has been unliked!" });
  } catch (err) {
    return res.status(404).json({ message: "Couldn't unlike the post: ", err });
  }
});

app.post("/delete-post", verifySession, async (req, res) => {
  const { postId } = req.body;
  try {
    const deletedPost = db.prepare("DELETE FROM posts WHERE id=?").run(postId);
    return res.status(200).json({ message: "Post has been deleted!" });
  } catch (err) {
    return res.status(404).json({ message: "Couldn't delete the post: ", err });
  }
});

app.post("/post-comment", verifySession, async (req, res) => {
  const { postId, content, comment_date } = req.body;
  const { userId } = req;

  if (content.length === 0 || !content || content.length > MAX_COMMENT_LENGTH) {
    return res
      .status(404)
      .json({ message: "Provided comment is too long or doesn't exist" });
  }

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

app.post("/delete-comment", verifySession, async (req, res) => {
  const { commentId } = req.body;

  try {
    const commentToDelete = db
      .prepare("DELETE from comments WHERE id = ?")
      .run(commentId);

    return res.status(200).json({ message: "Comment has been deleted!" });
  } catch (err) {
    return res
      .status(404)
      .json({ message: "Couldn't delete the comment: ", err });
  }
});

app.post("/comment-like", verifySession, async (req, res) => {
  const { commentId } = req.body;
  const { userId } = req;
  try {
    const foundUserData = db
      .prepare("SELECT name, surname FROM users WHERE id = ?")
      .get(userId);

    const author = foundUserData.name + " " + foundUserData.surname;

    const commentLiked = db
      .prepare("INSERT INTO comment_likes (user_id, comment_id) VALUES (?, ?)")
      .run(userId, commentId);

    return res.status(200).json({ message: "Comment has been liked!" });
  } catch (err) {
    return res
      .status(404)
      .json({ message: "Couldn't like the comment: ", err });
  }
});

app.post("/delete-comment-like", verifySession, async (req, res) => {
  const { commentId } = req.body;
  const { userId } = req;
  try {
    const deleteLiked = db
      .prepare("DELETE FROM comment_likes WHERE user_id=? AND comment_id=?")
      .run(userId, commentId);

    return res.status(200).json({ message: "Comment has been unliked!" });
  } catch (err) {
    return res
      .status(404)
      .json({ message: "Couldn't unlike the comment: ", err });
  }
});

app.get("/get-comment-likes", verifySession, async (req, res) => {
  const { commentId } = req.query;
  try {
    const likes = db
      .prepare("SELECT * from comment_likes WHERE comment_id = ?")
      .all(commentId);
    return res.status(200).json(likes);
  } catch (err) {
    return res.status(404).json({ message: "Couldn't get likes: ", err });
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

app.get("/chat-messages", verifySession, async (req, res) => {
  const { receiverId, senderId } = req.query;
  try {
    const foundMessages = db
      .prepare(
        "SELECT * FROM messages WHERE (receiver_id = ? AND sender_id = ?) OR (receiver_id = ? AND sender_id = ?)"
      )
      .all(receiverId, senderId, senderId, receiverId);

    return res.status(200).json(foundMessages);
  } catch (err) {
    return res.status(404).json({ message: "Couldn't get chat messages" });
  }
});

app.post("/send-message", verifySession, async (req, res) => {
  const { receiverId, senderId, content, messageDate } = req.body;
  try {
    const newMessage = db
      .prepare(
        "INSERT INTO messages (receiver_id, sender_id, content, message_date) VALUES (?, ?, ?, ?)"
      )
      .run(receiverId, senderId, content, messageDate);
    return res.status(200).json({ message: "Message has been sent" });
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

app.post("/user-register", async (req, res) => {
  const { name, surname, email, password, birthdate, gender, country, city } =
    req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ message: "Provided email is incorrect" });
  }

  if (password.length < 8 || password.length > 64) {
    return res.status(400).json({
      message:
        "Password should be longer than 8 characters and shorter than 64 characters.",
    });
  }

  if (
    !surname ||
    surname.length > MAX_STRING_LENGTH ||
    surname.length === 0 ||
    !birthdate ||
    !gender ||
    !country ||
    !city ||
    city.length > MAX_STRING_LENGTH ||
    city.length === 0
  ) {
    return res.status(400).json({
      message:
        "One of the mandatory fields is empty or incorrect, please fill your data.",
    });
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
