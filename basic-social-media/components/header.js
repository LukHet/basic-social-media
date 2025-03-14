"use client";

import Button from "./button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import SearchInput from "./search-input";
import { APIURL } from "@/constants/app-info";

export default function Header({ inLoginButtonVisible }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [foundUsers, setFoundUsers] = useState([]);

  useEffect(() => {
    const userData = async () => {
      try {
        const response = await axios.get(APIURL + "/user-data", {
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

  useEffect(() => {
    const getSearchResults = async () => {
      if (searchValue.length === 0) {
        setFoundUsers([]);
        return;
      }
      try {
        const response = await axios.get(APIURL + "/search-users", {
          params: { searchValue: searchValue },
          withCredentials: true,
        });
        setFoundUsers(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    getSearchResults();
  }, [searchValue]);

  const logout = async () => {
    await axios
      .get(APIURL + "/user-logout", {
        withCredentials: true,
      })
      .then((res) => router.push("/main-page"))
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const handleProfileInSearchClick = () => {
    setSearchValue("");
    setFoundUsers([]);
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
            <SearchInput
              value={searchValue}
              onChange={handleSearch}
              foundData={foundUsers}
              handleProfileInSearchClick={handleProfileInSearchClick}
            />
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
