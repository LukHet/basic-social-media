"use client";

import Button from "./button";
import TextInput from "./text-input";
import { useState, useEffect } from "react";
import axios from "axios";
import PostComments from "./post-comments";

export default function Comment({ postId }) {
  const [comment, setComment] = useState("");
  const [postComments, setPostComments] = useState([]);

  useEffect(() => {
    getPostComments();
  }, []);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const getPostComments = async () => {
    try {
      const res = await axios.get("http://localhost:8080/get-comments", {
        params: { postId: postId },
        withCredentials: true,
      });
      setPostComments(res.data);
    } catch (err) {}
  };

  const postComment = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/post-comment",
        {
          content: comment,
          postId: postId,
        },
        {
          withCredentials: true,
        }
      );
      await getPostComments();
      setComment("");
    } catch (err) {}
  };
  return (
    <div className="max-w-[100%] mt-5">
      <p>Add comment:</p>
      <div className="mt-2">
        <TextInput
          placeholder="Type your comment here..."
          onChange={handleCommentChange}
          value={comment}
        />
        <Button label="Post comment" onClick={postComment} />
      </div>
      <PostComments comments={postComments} />
    </div>
  );
}
