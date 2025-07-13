"use client";

import Link from "next/link";
import Comment from "./comment";
import Like from "./like";
import CopyButton from "./copy-button";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import { APIURL } from "@/constants/app-info";
import { redirect } from "next/navigation";

export default function Post({ post, userId, deletePost }) {
  const [profileImage, setProfileImage] = useState(null);
  const [copyButtonText, setCopyButtonText] = useState("Copy posts link");

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const href = post ? `/profile/${post.user_id}` : null;
  const isOwnPost = post ? post.user_id === userId : false;
  let objectUrl = null;

  useEffect(() => {
    getProfilePicture();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, []);

  const handleShareClick = () => {
    if (post && post.id) {
      redirect(`post-view/${post.id}`);
    }
  };

  const handleCopyPostsLinkClick = () => {
    const postUrl = baseUrl + "/" + `post-view/${post.id}`;
    navigator.clipboard.writeText(postUrl);
    setCopyButtonText("Copied to clipboard!");
  };

  const getProfilePicture = async () => {
    try {
      const response = await axios.get(APIURL + "/get-picture", {
        params: { userId: post.user_id },
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
    <div className="main-page mt-5 max-w-screen-lg py-5 px-10 rounded-3xl container mx-auto post">
      {post ? (
        <>
          <div className="flex justify-between">
            <Link
              href={href}
              className="button border-black border-2 p-1 rounded-xl flex gap-2 align-center pt-2"
            >
              {post.author}
              <Image
                src={profileImage ? profileImage : "/user.png"}
                width={24}
                height={24}
                alt="user icon"
                className="rounded-lg"
              />
            </Link>
            <div className="flex h-fit items-center">
              <p>{post.post_date}</p>
              {isOwnPost ? (
                <Image
                  className="ml-3 bin"
                  src="/bin.png"
                  width={32}
                  height={32}
                  alt="bin"
                  onClick={() => deletePost(post.id)}
                />
              ) : null}
            </div>
          </div>
          <div
            className="mt-5 text-xl cursor-pointer"
            onClick={handleShareClick}
          >
            {post.content}
          </div>
          <div className="flex justify-between">
            <Like postId={post.id} userId={userId} />
            <CopyButton
              postId={post.id}
              onClick={handleCopyPostsLinkClick}
              label={copyButtonText}
            />
          </div>
          <Comment postId={post.id} userId={userId} isOwnPost={isOwnPost} />
        </>
      ) : (
        <p>Couldn't get the contents of the post!</p>
      )}
    </div>
  );
}
