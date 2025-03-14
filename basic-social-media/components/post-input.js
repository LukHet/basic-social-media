"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import TextArea from "./text-area";
import Button from "./button";
import Post from "./post";
import { APIURL } from "@/constants/app-info";

export default function PostInput() {
  const [postValue, setPostValue] = useState("");
  const [postInfo, setPostInfo] = useState("");
  const [posts, setPosts] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  const getPosts = async () => {
    try {
      const response = await axios.get(APIURL + "/posts", {
        withCredentials: true,
      });
      setPosts(response?.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getCurrentUsersId = async () => {
    try {
      const response = await axios.get(APIURL + "/user-id", {
        withCredentials: true,
      });
      setCurrentUserId(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getPosts();
    getCurrentUsersId();
  }, []);

  const onPostValueChange = (e) => {
    setPostValue(e.target.value);
  };

  const sendNewPost = async () => {
    const currentDate = new Date();
    const formattedCurrentDate = currentDate
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    try {
      const res = await axios.post(
        APIURL + "/user-post",
        {
          content: postValue,
          post_date: formattedCurrentDate,
        },
        {
          withCredentials: true,
        }
      );
      setPostValue("");
      setPostInfo(res?.data?.message);
      await getPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const deletePost = async (post_id) => {
    try {
      const res = await axios.post(
        APIURL + "/delete-post",
        {
          postId: post_id,
        },
        {
          withCredentials: true,
        }
      );
      await getPosts();
    } catch (err) {}
  };

  return (
    <>
      <div className="main-page mt-28 max-w-screen-lg p-5 rounded-3xl container mx-auto">
        <TextArea
          label="Add new post:"
          id="publish-post"
          value={postValue}
          onChange={onPostValueChange}
        />
        <Button label="Publish" onClick={sendNewPost} />
        <p className="mt-2">{postInfo}</p>
      </div>
      {posts.map((post) => (
        <Post
          post={post}
          key={post.id}
          deletePost={() => deletePost(post.id)}
          userId={currentUserId}
        />
      ))}
    </>
  );
}
