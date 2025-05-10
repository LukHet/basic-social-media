"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { APIURL } from "@/constants/app-info";

export default function ChatUsers({ sidebar }) {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [usersId, setUsersId] = useState(null);

  const getAvailableUsers = async () => {
    try {
      const response = await axios.get(APIURL + "/all-users", {
        withCredentials: true,
      });
      setAvailableUsers(response?.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getUsersId = async () => {
    try {
      const response = await axios.get(APIURL + "/user-data", {
        withCredentials: true,
      });
      setUsersId(response?.data?.id);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAvailableUsers();
    getUsersId();
  }, []);

  return (
    <div className={sidebar ? "mt-20" : ""}>
      {availableUsers && availableUsers.length > 0 && usersId
        ? availableUsers.map((user) => (
            <Link
              href={`/chat/${usersId}-${user.id}`}
              key={user.id}
              className={`button border-black border-2 p-1 rounded-xl flex gap-2 items-center pt-2 m-5 ${
                sidebar ? "w-[80%]" : "w-fit"
              }`}
            >
              {user.name} {user.surname}
              <Image
                src="/message.png"
                width={32}
                height={32}
                alt="message icon"
              />
            </Link>
          ))
        : null}
    </div>
  );
}
