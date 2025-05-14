"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CommentLike from "./comment-like";
import Image from "next/image";
import axios from "axios";
import { APIURL } from "@/constants/app-info";

export default function SingleComment({
  com,
  userId,
  deleteComment,
  isOwnPost,
}) {
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  let objectUrl = null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await getProfilePicture();
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    if (profileImage) return;

    fetchData();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, []);

  const getProfilePicture = async () => {
    try {
      const response = await axios.get(APIURL + "/get-picture", {
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

  return (
    <div className="mt-3 border-black border-2 p-3 rounded-xl">
      <div className="flex justify-between">
        <Link
          href={`/profile/${com.user_id}`}
          className="button border-black border-2 p-1 w-fit rounded-xl flex gap-2 align-center pt-2"
        >
          {com.author}
          <Image
            src={profileImage && !loading ? profileImage : "/user.png"}
            width={24}
            height={24}
            alt="user icon comment"
            className="rounded-lg"
          />
        </Link>
        <div className="flex h-fit items-center">
          <p>{com.comment_date}</p>
          {com.user_id === userId || isOwnPost ? (
            <Image
              className="ml-3 bin"
              src="/bin.png"
              width={32}
              height={32}
              alt="bin"
              onClick={() => deleteComment(com.id)}
            />
          ) : null}
        </div>
      </div>
      <p className="mt-2">{com.content}</p>
      <div className="mt-3">
        <CommentLike commentId={com.id} userId={userId} />
      </div>
    </div>
  );
}
