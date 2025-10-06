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
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
  MAX_FILE_SIZE,
} from "../constants/app-info.js";
import {
  isBase64PngorJpg,
  isIdValid,
  isUserDataValid,
  relationshipStatusApproved,
  relationshipStatusBlocked,
  relationshipStatusDeclined,
  relationshipStatusPending,
  relationshipTypeFriends,
  relationshipTypeNone,
} from "./helpers.js";
import { use } from "react";

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
app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));

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

app.get("/user-data", verifySession, (req, res) => {
  const authSessionFound = req.cookies.auth_session;
  const foundSession = db
    .prepare("SELECT user_id FROM sessions WHERE id = ?")
    .get(authSessionFound);
  const foundUserId = parseInt(foundSession?.user_id);
  const foundUserData = db
    .prepare(
      "SELECT email, name, surname, birthdate, gender, city, country, id FROM users WHERE id = ?"
    )
    .get(foundUserId);
  return res.status(200).json(foundUserData);
});

app.get("/user-id", verifySession, (req, res) => {
  const authSessionFound = req.cookies.auth_session;
  const foundSession = db
    .prepare("SELECT user_id FROM sessions WHERE id = ?")
    .get(authSessionFound);
  const foundUserId = parseInt(foundSession?.user_id);
  return res.status(200).json(foundUserId);
});

app.get("/verify-user", verifySession, (req, res) => {
  res
    .status(200)
    .json({ message: "Welcome to the main page", userId: req.userId });
});

app.get("/all-users", verifySession, (req, res) => {
  const { userId } = req;

  if (!isIdValid(userId)) {
    return res.status(400).send("Invalid user ID");
  }

  try {
    const allUsers = db
      .prepare("SELECT name, surname, id FROM users WHERE NOT id = ?")
      .all(userId);

    return res.status(200).json(allUsers);
  } catch (err) {
    return res.status(500).send("Couldn't get the users");
  }
});

app.post("/user-logout", verifySession, async (req, res) => {
  const authSessionFound = req.cookies.auth_session;

  if (!authSessionFound || typeof authSessionFound !== "string") {
    return res.status(400).send("Invalid session");
  }

  const foundUser = db
    .prepare("SELECT user_id FROM sessions WHERE id = ?")
    .get(authSessionFound);

  if (!foundUser) {
    return res.status(404).send("Session not found");
  }

  try {
    await deleteAuthSession(res, foundUser.user_id);
    return res.send("Logged out successfully!");
  } catch (error) {
    return res.status(500).send("Failed to log out");
  }
});

app.post("/user-post", verifySession, async (req, res) => {
  const { content, post_date } = req.body;
  const { userId } = req;

  if (!isIdValid(userId)) {
    return res.status(400).json({ message: "Provided valid user ID" });
  }

  if (
    typeof content !== "string" ||
    content.trim().length === 0 ||
    content.length > MAX_STRING_LENGTH
  ) {
    return res
      .status(400)
      .json({ message: "Provided post content has incorrect length" });
  }

  if (!post_date || isNaN(Date.parse(post_date))) {
    return res.status(400).json({ message: "Provided post date is invalid" });
  }

  const foundUser = db
    .prepare("SELECT name, surname FROM users WHERE id = ?")
    .get(userId);

  if (!foundUser) {
    return res.status(404).json({ message: "User not found" });
  }

  const userName = `${foundUser.name} ${foundUser.surname}`;
  try {
    const createdPost = db
      .prepare(
        "INSERT INTO posts (user_id, content, post_date, author) VALUES (?, ?, ?, ?)"
      )
      .run(userId, content, post_date, userName);

    return res.status(200).json({ message: "Post published successfully!" });
  } catch (err) {
    return res
      .status(400)
      .json({ message: "There was an error during publishing post" });
  }
});

app.get("/posts", verifySession, async (req, res) => {
  const postsLimit = 10;
  const postsOffset = 0;
  try {
    const posts = db
      .prepare(
        "SELECT id, user_id, author, post_date, content from posts ORDER BY post_date DESC LIMIT ? OFFSET ?"
      )
      .all(postsLimit, postsOffset);

    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/user-posts", verifySession, async (req, res) => {
  const { userId } = req;
  const userPostsLimit = 3;

  if (!isIdValid(userId)) {
    return res.status(400).json({ message: "Provided pvalid user ID" });
  }

  try {
    const posts = db
      .prepare(
        "SELECT id, user_id, author, post_date, content from posts WHERE user_id = ? LIMIT ?"
      )
      .all(userId, userPostsLimit);

    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch user posts" });
  }
});

app.get("/single-post", verifySession, async (req, res) => {
  const { postId } = req.query;

  if (!isIdValid(postId)) {
    return res.status(400).json({ message: "Invalid Post ID!" });
  }

  try {
    const post = db
      .prepare(
        "SELECT id, user_id, author, post_date, content from posts WHERE id = ?"
      )
      .get(postId);

    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json({ message: "There was an error" });
  }
});

app.get("/other-user-posts", verifySession, async (req, res) => {
  const { otherUserId } = req.query;

  if (!isIdValid(otherUserId)) {
    return res.status(400).json({ message: "Invalid Post ID!" });
  }

  try {
    const posts = db
      .prepare(
        "SELECT id, user_id, author, post_date, content from posts WHERE user_id = ?"
      )
      .all(otherUserId);

    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ message: "There was an error" });
  }
});

app.get("/get-likes", verifySession, async (req, res) => {
  const { postId } = req.query;

  if (!isIdValid(postId)) {
    return res.status(400).json({ message: "Invalid Post ID!" });
  }

  try {
    const likes = db
      .prepare("SELECT id, user_id, author from likes WHERE post_id = ?")
      .all(postId);

    return res.status(200).json(likes);
  } catch (err) {
    return res.status(404).json({ message: "Couldn't get likes: ", err });
  }
});

app.get("/get-comments", verifySession, async (req, res) => {
  const { postId } = req.query;

  if (!isIdValid(postId)) {
    return res.status(400).json({ message: "Invalid Post ID!" });
  }

  try {
    const comments = db
      .prepare(
        "SELECT id, user_id, author, comment_date, content from comments WHERE post_id = ? LIMIT 3"
      )
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

  if (
    !searchValue ||
    searchValue.length <= 0 ||
    searchValue.length > MAX_STRING_LENGTH
  ) {
    return res.status(400).json({ message: "Invalid search value!" });
  }

  try {
    const foundUsers = db
      .prepare(
        "SELECT name, surname, id FROM users WHERE name LIKE ? OR surname LIKE ? LIMIT 5"
      )
      .all([`%${searchValue}%`, `%${searchValue}%`]);

    res.status(200).json(foundUsers);
  } catch (err) {
    res.status(500).json({ message: "Couldn't find the users: ", err });
  }
});

app.post("/post-like", verifySession, async (req, res) => {
  const { postId } = req.body;
  const { userId } = req;

  if (!isIdValid(postId)) {
    return res.status(400).json({ message: "Invalid Post ID!" });
  }

  if (!isIdValid(userId)) {
    return res.status(400).json({ message: "Invalid User ID!" });
  }

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

  if (!isIdValid(postId)) {
    return res.status(400).json({ message: "Invalid Post ID!" });
  }

  if (!isIdValid(userId)) {
    return res.status(400).json({ message: "Invalid User ID!" });
  }

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

  if (!isIdValid(postId)) {
    return res.status(400).json({ message: "Invalid Post ID!" });
  }

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

  if (!isIdValid(userId)) {
    return res.status(400).json({ message: "Invalid User ID!" });
  }

  if (!isIdValid(postId)) {
    return res.status(400).json({ message: "Invalid Post ID!" });
  }

  if (content.length === 0 || !content || content.length > MAX_COMMENT_LENGTH) {
    return res
      .status(404)
      .json({ message: "Provided comment is too long or doesn't exist" });
  }

  const parsedDate = new Date(comment_date);

  if (!comment_date || isNaN(parsedDate.getTime())) {
    return res
      .status(400)
      .json({ message: "Invalid or missing comment date!" });
  }

  const now = new Date();
  if (parsedDate > now) {
    return res
      .status(400)
      .json({ message: "Comment date cannot be in the future." });
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

app.post("/post-picture", verifySession, async (req, res) => {
  const { userId } = req;
  const { content } = req.body;

  if (!isIdValid(userId)) {
    return res.status(400).json({ message: "Invalid User ID!" });
  }

  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }

  if (!content.split(",")[0] || !content.split(",")[1]) {
    return res
      .status(400)
      .json({ message: "Something went wrong, please upload another file." });
  }

  const contentInfo = content.split(",")[0];

  if (!isBase64PngorJpg(contentInfo)) {
    return res.status(400).json({ message: "Invalid file format." });
  }

  try {
    const base64String = content.split(",")[1];
    const buffer = Buffer.from(base64String, "base64");

    if (buffer.length > MAX_FILE_SIZE) {
      return res
        .status(400)
        .json({ message: "File is too large. Max 2MB allowed." });
    }
    const deleteOldUserPictures = db
      .prepare("DELETE FROM profile_pictures WHERE user_id=?")
      .run(userId);

    const pictureToPost = db
      .prepare("INSERT INTO profile_pictures (user_id, content) VALUES (?, ?)")
      .run(userId, buffer);

    return res.status(200).json({ message: "Picture has been updated!" });
  } catch (err) {
    return res.status(500).json({ message: "Couldn't update picture: ", err });
  }
});

app.get("/get-picture", verifySession, async (req, res) => {
  const ownPicture = req.query.ownPicture === "true"; //converting string into boolean
  let { userId } = req.query;

  if (ownPicture) {
    userId = req.userId;
  }

  if (!isIdValid(userId)) {
    return res.status(400).json({ message: "Missing userId." });
  }

  try {
    const foundPicture = db
      .prepare("SELECT content FROM profile_pictures WHERE user_id = ?")
      .get(userId);

    if (!foundPicture) {
      return res.status(204).json({ message: "Picture not available." });
    }

    return res.status(200).json(foundPicture);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Couldn't fetch the picture.", error: err.message });
  }
});

app.post("/change-password", verifySession, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { userId } = req;

  if (!isIdValid(userId)) {
    return res.status(400).json({ message: "Provide user ID." });
  }

  if (
    !oldPassword ||
    oldPassword.length === 0 ||
    !newPassword ||
    newPassword.length === 0
  ) {
    return res.status(400).json({ message: "Provide old/new password." });
  }

  if (
    typeof oldPassword !== "string" ||
    typeof newPassword !== "string" ||
    !oldPassword.trim() ||
    !newPassword.trim()
  ) {
    return res.status(400).json({ message: "Invalid password input." });
  }

  if (oldPassword === newPassword) {
    return res
      .status(400)
      .json({ message: "New password must be different from the old one." });
  }

  if (
    newPassword.length < MIN_PASSWORD_LENGTH ||
    newPassword.length > MAX_PASSWORD_LENGTH
  ) {
    return res.status(400).json({
      message:
        "New password should be longer than 8 characters and shorter than 64 characters.",
    });
  }

  try {
    const usersPassword = db
      .prepare("SELECT password FROM users WHERE id = ?")
      .get(userId);

    if (!usersPassword) {
      return res.status(404).json({ message: "User not found." });
    }

    const comparePasswordsResult = await bcrypt.compare(
      oldPassword,
      usersPassword.password
    );

    if (comparePasswordsResult) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      const update = db
        .prepare("UPDATE users SET password = ? WHERE id = ?")
        .run(hashedPassword, userId);

      return res
        .status(200)
        .json({ message: "Password has been succesfully changed!" });
    } else {
      return res
        .status(401)
        .json({ message: "The given old password was incorrect!" });
    }
  } catch (err) {
    return res.status(404).json({ message: "Couldn't change the password." });
  }
});

app.post("/delete-comment", verifySession, async (req, res) => {
  const { commentId } = req.body;

  if (!isIdValid(commentId)) {
    return res.status(400).json({ message: "Provide valid comment ID." });
  }

  try {
    const commentToDelete = db
      .prepare("DELETE from comments WHERE id = ?")
      .run(commentId);

    if (!commentToDelete) {
      return res.status(404).json({ message: "Couldn't find the comment." });
    }

    return res.status(200).json({ message: "Comment has been deleted!" });
  } catch (err) {
    return res.status(404).json({ message: "Couldn't delete the comment." });
  }
});

app.post("/comment-like", verifySession, async (req, res) => {
  const { commentId } = req.body;
  const { userId } = req;

  if (!isIdValid(commentId)) {
    return res.status(400).json({ message: "Provide valid comment ID." });
  }

  if (!isIdValid(userId)) {
    return res.status(400).json({ message: "Provide valid user ID." });
  }

  try {
    const alreadyLiked = db
      .prepare(
        "SELECT 1 FROM comment_likes WHERE user_id = ? AND comment_id = ?"
      )
      .get(userId, commentId);

    if (alreadyLiked) {
      return res.status(400).json({ message: "Comment already liked." });
    }

    const foundUserData = db
      .prepare("SELECT name, surname FROM users WHERE id = ?")
      .get(userId);

    if (!foundUserData) {
      return res.status(400).json({ message: "Couldn't find the user." });
    }

    const author = foundUserData.name + " " + foundUserData.surname;

    const commentLiked = db
      .prepare("INSERT INTO comment_likes (user_id, comment_id) VALUES (?, ?)")
      .run(userId, commentId);

    if (!commentLiked) {
      return res.status(400).json({ message: "Couldn't find the comment." });
    }

    return res.status(200).json({ message: "Comment has been liked!" });
  } catch (err) {
    return res.status(500).json({ message: "Couldn't like the comment." });
  }
});

app.post("/delete-comment-like", verifySession, async (req, res) => {
  const { commentId } = req.body;
  const { userId } = req;

  if (!isIdValid(commentId)) {
    return res.status(400).json({ message: "Provide valid comment ID." });
  }

  if (!isIdValid(userId)) {
    return res.status(400).json({ message: "Provide valid user ID." });
  }

  try {
    const deleteLiked = db
      .prepare("DELETE FROM comment_likes WHERE user_id=? AND comment_id=?")
      .run(userId, commentId);

    if (!deleteLiked) {
      return res
        .status(400)
        .json({ message: "Couldn't find the liked comment." });
    }

    return res.status(200).json({ message: "Comment has been unliked!" });
  } catch (err) {
    return res.status(404).json({ message: "Couldn't unlike the comment." });
  }
});

app.get("/get-comment-likes", verifySession, async (req, res) => {
  const { commentId } = req.query;

  if (!isIdValid(commentId)) {
    return res.status(400).json({ message: "Provide valid comment ID." });
  }

  try {
    const likes = db
      .prepare("SELECT user_id from comment_likes WHERE comment_id = ?")
      .all(commentId);

    if (!likes) {
      return res
        .status(404)
        .json({ message: "Comment has no likes or it doesn't exist." });
    }
    return res.status(200).json(likes);
  } catch (err) {
    return res.status(404).json({ message: "Couldn't get likes." });
  }
});

app.get("/other-user-data", verifySession, async (req, res) => {
  const { otherUserId } = req.query;

  if (!isIdValid(otherUserId)) {
    return res.status(400).json({ message: "Provide valid user ID." });
  }

  const foundUserData = db
    .prepare(
      "SELECT email, name, surname, birthdate, gender, city, country FROM users WHERE id = ?"
    )
    .get(otherUserId);

  if (!foundUserData) {
    return res.status(404).json({ message: "Given user doesn't exist." });
  }

  return res.status(200).json(foundUserData);
});

app.get("/chat-messages", verifySession, async (req, res) => {
  const { receiverId, senderId } = req.query;

  if (!isIdValid(receiverId)) {
    return res.status(400).json({ message: "Provide valid receiver ID." });
  }

  if (!isIdValid(senderId)) {
    return res.status(400).json({ message: "Provide valid sender ID." });
  }

  try {
    const foundMessages = db
      .prepare(
        "SELECT id, content, sender_id, message_date FROM messages WHERE (receiver_id = ? AND sender_id = ?) OR (receiver_id = ? AND sender_id = ?)"
      )
      .all(receiverId, senderId, senderId, receiverId);

    return res.status(200).json(foundMessages);
  } catch (err) {
    return res.status(404).json({ message: "Couldn't get chat messages" });
  }
});

app.post("/send-message", verifySession, async (req, res) => {
  const { receiverId, senderId, content, messageDate } = req.body;

  if (!isIdValid(receiverId)) {
    return res.status(400).json({ message: "Provide valid receiver ID." });
  }

  if (!isIdValid(senderId)) {
    return res.status(400).json({ message: "Provide valid sender ID." });
  }

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

  if (
    password.length < MIN_PASSWORD_LENGTH ||
    password.length > MAX_PASSWORD_LENGTH
  ) {
    return res.status(400).json({
      message:
        "Password should be longer than 8 characters and shorter than 64 characters.",
    });
  }

  if (isUserDataValid(name, surname, email, birthdate, gender, country, city)) {
    return res.status(400).json({
      message:
        "One of the mandatory fields is empty or incorrect, please fill your data.",
    });
  }

  const saltRounds = 10;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const existingUser = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(email);

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

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

  if (!isIdValid(userId)) {
    return res.status(400).json({ message: "Provide valid user ID." });
  }

  if (isUserDataValid(name, surname, email, birthdate, gender, country, city)) {
    return res.status(400).json({
      message:
        "One of the mandatory fields is empty or incorrect, please fill your data.",
    });
  }

  try {
    const existingUser = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(email);

    if (existingUser && existingUser.id !== userId) {
      return res
        .status(409)
        .json({ message: "Email is already in use by another account" });
    }

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
      .prepare("SELECT password, id FROM users WHERE email = ?")
      .get(email);

    if (!foundUser) {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect" });
    }

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

app.get("/friends-list", verifySession, async (req, res) => {
  const { userId } = req;

  if (!isIdValid(userId)) {
    return res.status(400).json({ message: "Provide valid user ID." });
  }

  try {
    const friendsList = db
      .prepare(
        `
      SELECT u.id, u.name, u.surname, u.email
        FROM users u
        JOIN user_relationship r ON 
          (u.id = r.user_first_id AND r.user_second_id = ?)
          OR (u.id = r.user_second_id AND r.user_first_id = ?)
      WHERE r.status = 'accepted'
    `
      )
      .all(userId);

    res.status(200).json({ friend: friendsList });
  } catch (err) {
    res.status(500).json({ message: "Couldn't retrieve friends list", err });
  }
});

app.post("/send-friend-request", verifySession, async (req, res) => {
  const { userId } = req;
  const { friendId } = req.body;

  if (!isIdValid(userId)) {
    return res.status(400).json({ message: "Provide valid user ID." });
  }

  if (!isIdValid(friendId)) {
    return res.status(400).json({ message: "Provide valid friend ID." });
  }

  const existing = db
    .prepare(
      "SELECT * FROM user_relationship WHERE (user_first_id = ? AND user_second_id = ?) OR (user_second_id = ? AND user_first_id = ?)"
    )
    .get(userId, friendId, friendId, userId);

  if (existing) {
    return res.status(400).json({
      message: "Friend request already exists or you're already friends.",
    });
  }

  try {
    const sendFriendRequest = db
      .prepare(
        `INSERT INTO user_relationship (user_first_id, user_second_id, type, status) VALUES (?, ?, ?, ?)`
      )
      .run(
        userId,
        friendId,
        relationshipTypeFriends,
        relationshipStatusPending
      );

    res.status(200).json({ message: "Friend request has been sent" });
  } catch (err) {
    res.status(500).json({ message: "Couldn't send friend request", err });
  }
});

app.post("/accept-friend-request", verifySession, async (req, res) => {
  const { userId } = req;
  const { friendId } = req.body;

  if (!isIdValid(userId)) {
    return res.status(400).json({ message: "Provide valid user ID." });
  }

  if (!isIdValid(friendId)) {
    return res.status(400).json({ message: "Provide valid friend ID." });
  }

  const existing = db
    .prepare(
      "SELECT * FROM user_relationship WHERE (user_first_id = ? AND user_second_id = ?) OR (user_second_id = ? AND user_first_id = ?)"
    )
    .get(userId, friendId, friendId, userId);

  if (existing) {
    return res.status(400).json({
      message: "Friend request already exists or you're already friends.",
    });
  }

  try {
    const acceptFriendRequest = db
      .prepare(
        `UPDATE user_relationship (type, status) VALUES (?, ?, ?, ?) WHERE (user_first_id = ? AND user_second_id = ?) OR (user_second_id = ? AND user_first_id = ?)`
      )
      .run(
        relationshipTypeFriends,
        relationshipStatusApproved,
        userId,
        friendId,
        friendId,
        userId
      );

    res.status(200).json({ message: "Friend request has been accepted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Couldn't accept the friend request", err });
  }
});

app.post("/decline-friend-request", verifySession, async (req, res) => {
  const { userId } = req;
  const { friendId } = req.body;

  if (!isIdValid(userId)) {
    return res.status(400).json({ message: "Provide valid user ID." });
  }

  if (!isIdValid(friendId)) {
    return res.status(400).json({ message: "Provide valid friend ID." });
  }

  const existing = db
    .prepare(
      "SELECT * FROM user_relationship WHERE (user_first_id = ? AND user_second_id = ?) OR (user_second_id = ? AND user_first_id = ?)"
    )
    .get(userId, friendId, friendId, userId);

  if (existing) {
    return res.status(400).json({
      message: "Friend request already exists or you're already friends.",
    });
  }

  try {
    const declineFriendRequest = db
      .prepare(
        `UPDATE user_relationship (type, status) VALUES (?, ?, ?, ?) WHERE (user_first_id = ? AND user_second_id = ?) OR (user_second_id = ? AND user_first_id = ?)`
      )
      .run(
        relationshipTypeFriends,
        relationshipStatusDeclined,
        userId,
        friendId,
        friendId,
        userId
      );

    res.status(200).json({ message: "Friend request has been declined" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Couldn't decline the friend request", err });
  }
});

app.post("/block-user", verifySession, async (req, res) => {
  const { userId } = req;
  const { friendId } = req.body;

  if (!isIdValid(userId)) {
    return res.status(400).json({ message: "Provide valid user ID." });
  }

  if (!isIdValid(friendId)) {
    return res.status(400).json({ message: "Provide valid friend ID." });
  }

  const existing = db
    .prepare(
      "SELECT * FROM user_relationship WHERE ((user_first_id = ? AND user_second_id = ?) OR (user_second_id = ? AND user_first_id = ?)) AND status = ?"
    )
    .get(userId, friendId, friendId, userId, relationshipStatusBlocked);

  if (existing) {
    return res.status(400).json({
      message: "User has already been blocked.",
    });
  }

  try {
    const blockUser = db
      .prepare(
        `UPDATE user_relationship (type, status) VALUES (?, ?, ?, ?) WHERE (user_first_id = ? AND user_second_id = ?) OR (user_second_id = ? AND user_first_id = ?)`
      )
      .run(
        relationshipTypeFriends,
        relationshipStatusBlocked,
        userId,
        friendId,
        friendId,
        userId
      );

    res.status(200).json({ message: "User has been blocked" });
  } catch (err) {
    res.status(500).json({ message: "Couldn't block the user", err });
  }
});

app.post("/delete-user-from-friendslist", verifySession, async (req, res) => {
  const { userId } = req;
  const { friendId } = req.body;

  if (!isIdValid(userId)) {
    return res.status(400).json({ message: "Provide valid user ID." });
  }

  if (!isIdValid(friendId)) {
    return res.status(400).json({ message: "Provide valid friend ID." });
  }

  const existing = db
    .prepare(
      "SELECT * FROM user_relationship WHERE ((user_first_id = ? AND user_second_id = ?) OR (user_second_id = ? AND user_first_id = ?)) AND type = ?"
    )
    .get(userId, friendId, friendId, userId, relationshipTypeFriends);

  if (!existing) {
    return res.status(400).json({
      message: "User was not on friendslist or has already been unfriended.",
    });
  }

  try {
    const deleteUserFromFriendslist = db
      .prepare(
        `UPDATE user_relationship (type, status) VALUES (?, ?, ?, ?) WHERE (user_first_id = ? AND user_second_id = ?) OR (user_second_id = ? AND user_first_id = ?)`
      )
      .run(
        relationshipTypeNone,
        relationshipStatusDeclined,
        userId,
        friendId,
        friendId,
        userId
      );

    res.status(200).json({ message: "User has been deleted from friendslist" });
  } catch (err) {
    res.status(500).json({ message: "Couldn't delete from friendslist", err });
  }
});

app.listen(8080);

export default db;
