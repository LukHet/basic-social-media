import { NextResponse } from "next/server";
import axios from "axios";

export async function middleware(request) {
  try {
    const res = await axios.get("http://localhost:8080/verify-user");
    console.log(res.data);
  } catch (error) {
    console.error("Error making API request:", error.message);
  }

  const authSessionCookie = request.cookies.get("auth_session");
  if (authSessionCookie) {
    console.log(authSessionCookie.value);
  } else {
    console.log("No auth_session cookie found");
  }

  return NextResponse.next();
}
