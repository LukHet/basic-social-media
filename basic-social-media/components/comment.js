"use client";

import Button from "./button";
import TextInput from "./text-input";
import { useState, useEffect } from "react";
import axios from "axios";
import PostComments from "./post-comments";
import { APIURL } from "@/constants/app-info";

export default function Comment({ postId, userId, isOwnPost }) {
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
      const res = await axios.get(APIURL + "/get-comments", {
        params: { postId: postId },
        withCredentials: true,
      });
      setPostComments(res.data);
    } catch (err) {}
  };

  const deleteComment = async (commentId) => {
    try {
      const res = await axios.post(
        APIURL + "/delete-comment",
        {
          commentId: commentId,
        },
        {
          withCredentials: true,
        }
      );
      await getPostComments();
    } catch (err) {}
  };

  const postComment = async () => {
    const currentDate = new Date();
    const formattedCurrentDate = currentDate
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    try {
      const res = await axios.post(
        APIURL + "/post-comment",
        {
          content: comment,
          postId: postId,
          comment_date: formattedCurrentDate,
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
      <PostComments
        comments={postComments}
        userId={userId}
        deleteComment={deleteComment}
        isOwnPost={isOwnPost}
      />
    </div>
  );
}
