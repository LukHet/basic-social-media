"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Post from "./post";

export default function ProfilePosts() {
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/user-posts", {
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
      <h1 className="text-center font-bold">Your posts:</h1>
      {posts.length !== 0 &&
        posts.map((post) => <Post post={post} key={post.id} />)}
    </div>
  );
}
