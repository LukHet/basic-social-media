"use client";

import { useState, useEffect } from "react";
import TextArea from "./text-area";
import Button from "./button";
import Post from "./post";
import { MAX_POST_LENGTH } from "@/constants/app-info";
import { apiPostData } from "@/app/apiConnectors/apiPostData";
import { apiGetData } from "@/app/apiConnectors/apiGetData";

export default function PostInput() {
  const [postValue, setPostValue] = useState("");
  const [postInfo, setPostInfo] = useState("");
  const [posts, setPosts] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [postLength, setPostLength] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const getPosts = async () => {
    try {
      const response = await apiGetData("/posts", {}, true);
      setPosts(response?.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getCurrentUsersId = async () => {
    try {
      const response = await apiGetData("/user-id", {}, true);
      setCurrentUserId(response?.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getPosts();
    getCurrentUsersId();
  }, []);

  const onPostValueChange = (e) => {
    const postValue = e.target.value;
    setButtonDisabled(postValue.length === 0);
    if (postValue.length >= MAX_POST_LENGTH + 1) return;
    setPostValue(postValue);
    setPostLength(postValue.length);
  };

  const sendNewPost = async () => {
    if (!postValue || postValue.length === 0) {
      return;
    }
    const currentDate = new Date();
    const formattedCurrentDate = currentDate
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    try {
      const res = await apiPostData(
        "/user-post",
        {
          content: postValue,
          post_date: formattedCurrentDate,
        },
        true
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

  return (
    <>
      <div className="main-page mt-28 max-w-screen-lg p-5 rounded-3xl container mx-auto">
        <TextArea
          label="Add new post:"
          id="publish-post"
          value={postValue}
          onChange={onPostValueChange}
        />
        <div className="flex justify-between items-center">
          <Button
            label="Publish"
            onClick={sendNewPost}
            additionalClass="!mx-1"
            disabled={buttonDisabled}
          />
          <p>
            {postLength} / {MAX_POST_LENGTH}
          </p>
        </div>
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
