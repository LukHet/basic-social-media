"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Post from "./post";

export default function ProfilePosts({ isOwnProfile, slug }) {
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    try {
      const response = isOwnProfile
        ? await axios.get("http://localhost:8080/user-posts", {
            withCredentials: true,
          })
        : await axios.get("http://localhost:8080/other-user-posts", {
            params: { otherUserId: slug },
            withCredentials: true,
          });
      setPosts(response?.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="mt-10 posts max-w-screen-sm mx-auto p-2 rounded-2xl">
      <h1 className="text-center font-bold">
        {posts.length !== 0
          ? isOwnProfile
            ? "Your posts:"
            : "Profiles posts:"
          : "No profile posts found!"}
      </h1>
      {posts.length !== 0 &&
        posts.map((post) => <Post post={post} key={post.id} />)}
    </div>
  );
}
