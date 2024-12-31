"use client";

import Button from "./button";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Header({ inLoginButtonVisible }) {
  const router = useRouter();

  const logout = async () => {
    await axios
      .get("http://localhost:8080/user-logout", {
        withCredentials: true,
      })
      .then((res) => router.push("/main-page"))
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <header className="flex justify-center">
        <nav className="top-0 border-solid rounded-3xl fixed border-b-black border-b-2 z-50 flex items-center justify-between flex-wrap p-6 header">
          <Button label="Main page" href="main-page" />
          <Button label="Chat" href="chat" />
          {inLoginButtonVisible ? (
            <Button label="Log in" href="login-page" />
          ) : (
            <Button label="Log out" onClick={logout} />
          )}
        </nav>
      </header>
    </>
  );
}
