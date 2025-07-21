"use client";

import Button from "./button";
import axios from "axios";
import Image from "next/image";
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
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    let objectUrl;

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

    const getProfilePicture = async () => {
      try {
        const response = await axios.get(APIURL + "/get-picture", {
          params: { ownPicture: true },
          withCredentials: true,
        });
        if (response?.data?.content?.data) {
          const byteArray = new Uint8Array(response.data.content.data);
          const blob = new Blob([byteArray]);
          objectUrl = URL.createObjectURL(blob);
          setProfileImage(objectUrl);
        }
      } catch (err) {
        console.error(err);
      }
    };

    userData();
    getProfilePicture();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
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
      .post(APIURL + "/user-logout", {
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
        <nav className="top-0 border-solid rounded-3xl fixed border-b-black border-b-2 z-40 flex items-center justify-between flex-wrap p-6 header">
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
            <motion.div
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xl mt-2 font-bold"
            >
              <Link
                href="/profile-page"
                className="button border-black border-2 p-1 rounded-xl"
              >
                {username}
              </Link>
            </motion.div>
            <Image
              width={42}
              height={42}
              alt="Profile picture"
              src={profileImage ? profileImage : "/picture_placeholder.png"}
              className="rounded-full ml-2"
            />
          </>
        </nav>
      </header>
    </>
  );
}
