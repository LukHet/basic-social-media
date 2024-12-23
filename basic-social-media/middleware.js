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

    console.log("gitara");
  } catch (error) {
    console.error("Error making API request:", error.message);
    NextResponse.redirect(new URL("/login-page", request.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!login-page|register-page).*)", //matching all paths except for login and register pages
  ],
};
