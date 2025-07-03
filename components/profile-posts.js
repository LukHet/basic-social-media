"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Post from "./post";
import { APIURL } from "@/constants/app-info";

export default function ProfilePosts({ isOwnProfile, slug }) {
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);

  const getPosts = async () => {
    try {
      const response = isOwnProfile
        ? await axios.get(APIURL + "/user-posts", {
            withCredentials: true,
          })
        : await axios.get(APIURL + "/other-user-posts", {
            params: { otherUserId: slug },
            withCredentials: true,
          });
      setPosts(response?.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getUserData = async () => {
    try {
      const response = await axios.get(APIURL + "/user-data", {
        withCredentials: true,
      });
      setUserId(response?.data?.id);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPosts();
    getUserData();
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
        posts.map((post) => <Post post={post} key={post.id} userId={userId} />)}
    </div>
  );
}
