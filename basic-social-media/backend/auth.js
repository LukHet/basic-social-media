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
    console.log("Session cookie set successfully");
  } catch (err) {
    console.error("Error creating auth session:", err);
    throw new Error("Failed to create auth session");
  }
}
