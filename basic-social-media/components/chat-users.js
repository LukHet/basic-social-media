"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

export default function ChatUsers() {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [usersId, setUsersId] = useState(null);

  const getAvailableUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/all-users", {
        withCredentials: true,
      });
      setAvailableUsers(response?.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getUsersId = async () => {
    try {
      const response = await axios.get("http://localhost:8080/user-data", {
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
    <div>
      {availableUsers && availableUsers.length > 0 && usersId
        ? availableUsers.map((user) => (
            <Link
              href={`/chat/${usersId}-${user.id}`}
              key={user.id}
              className="button border-black border-2 p-1 rounded-xl flex gap-2 align-center pt-2 w-fit m-5"
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
