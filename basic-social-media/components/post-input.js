"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import TextArea from "./text-area";
import Button from "./button";

export default function PostInput() {
  const [postValue, setPostValue] = useState("");
  const [postInfo, setPostInfo] = useState("");
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/posts", {
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

  const onPostValueChange = (e) => {
    setPostValue(e.target.value);
  };

  const sendNewPost = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/user-post",
        {
          content: postValue,
        },
        {
          withCredentials: true,
        }
      );
      setPostInfo(res?.data?.message);
      await getPosts();
    } catch (err) {
      console.error(err);
    }
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
        <div
          className="main-page mt-5 max-w-screen-lg py-5 px-10 rounded-3xl container mx-auto"
          key={post.id}
        >
          {post.content}
        </div>
      ))}
    </>
  );
}
