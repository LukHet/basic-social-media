"use server";

import "./setupCrypto.js";
import cookie from "cookie";
import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import db from "./db.js";

const adapter = new BetterSqlite3Adapter(db, {
  user: "users",
  session: "sessions",
});

const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: { secure: process.env.NODE_ENV === "production" },
  },
});

export async function createAuthSession(res, userId) {
  try {
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    const cookieHeader = cookie.serialize(
      sessionCookie.name,
      sessionCookie.value,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      }
    );
    res.setHeader("Set-Cookie", cookieHeader);
  } catch (err) {
    throw new Error("Failed to create auth session");
  }
}

export async function deleteAuthSession(res, userId) {
  try {
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    const cookieHeader = cookie.serialize(
      sessionCookie.name,
      sessionCookie.value,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 0,
        path: "/",
      }
    );
    res.setHeader("Set-Cookie", cookieHeader);
  } catch (err) {
    throw new Error("Failed to create auth session");
  }
}

export async function verifySession(req, res, next) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const sessionCookie = cookies[lucia.sessionCookieName];

  if (!sessionCookie) {
    return res.status(401).json({ message: "No session cookie found." });
  }

  try {
    const session = db
      .prepare("SELECT * FROM sessions WHERE id = ?")
      .get(sessionCookie);
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime > session.expires_at) {
      return res
        .status(401)
        .json({ message: "Session expired, please log in again." });
    }
    if (session) {
      req.userId = session.user_id;
      return next();
    } else {
      return res.status(401).json({ message: "Invalid session." });
    }
  } catch (err) {
    return res.status(500).json({ message: "Failed to verify session.", err });
  }
}
