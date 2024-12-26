import { NextResponse } from "next/server";
import axios from "axios";

export async function middleware(request) {
  try {
    const authSessionCookie = request.cookies.get("auth_session");

    const res = await axios.get("http://localhost:8080/verify-user", {
      headers: {
        Cookie: `auth_session=${
          authSessionCookie ? authSessionCookie.value : ""
        }`,
      },
      withCredentials: true,
    });
  } catch (error) {
    return NextResponse.redirect(
      new URL("/login-page", request.nextUrl.origin).href,
      {
        status: 303,
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api/auth|login-page|register-page).*)"],
};
