"use client";

import Button from "./button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import SearchInput from "./search-input";

export default function Header({ inLoginButtonVisible }) {
  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const userData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/user-data", {
          withCredentials: true,
        });
        const foundName = response.data.name;
        setUsername(foundName);
      } catch (err) {
        console.error(err);
      }
    };

    userData();
  }, []);

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
        <motion.div
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed z-50 text-xl mt-2 font-bold"
        >
          Hello{" "}
          <Link
            href="/profile-page"
            className="button border-black border-2 p-1 rounded-xl"
          >
            {username}
          </Link>
        </motion.div>
        <nav className="top-0 border-solid rounded-3xl pt-10 fixed border-b-black border-b-2 z-40 flex items-center justify-between flex-wrap p-6 header">
          <>
            <SearchInput />
            <Button label="Main page" href="/main-page" />
            <Button label="Chat" href="/chat" />
            {inLoginButtonVisible ? (
              <Button label="Log in" href="/login-page" />
            ) : (
              <Button label="Log out" onClick={logout} />
            )}
          </>
        </nav>
      </header>
    </>
  );
}
