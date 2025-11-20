"use client";

import { useState, useEffect } from "react";
import Post from "./post";
import { apiPostData } from "@/app/apiConnectors/apiPostData";
import { apiGetData } from "@/app/apiConnectors/apiGetData";

export default function ProfilePosts({ isOwnProfile, slug }) {
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);

  const getPosts = async () => {
    try {
      const response = isOwnProfile
        ? await apiGetData("/user-posts", {}, true)
        : await apiGetData("/other-user-posts", { otherUserId: slug }, true);
      setPosts(response?.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deletePost = async (post_id) => {
    try {
      await apiPostData(
        "/delete-post",
        {
          postId: post_id,
        },
        true
      );
      await getPosts();
    } catch (err) {
      console.log(err);
    }
  };

  const getUserData = async () => {
    try {
      const response = await apiGetData("/user-data", {}, true);
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
        posts.map((post) => (
          <Post
            post={post}
            key={post.id}
            userId={userId}
            deletePost={() => deletePost(post.id)}
          />
        ))}
    </div>
  );
}
