"use client";

import Button from "./button";
import TextInput from "./text-input";
import { useState, useEffect } from "react";
import axios from "axios";
import PostComments from "./post-comments";
import { APIURL, MAX_COMMENT_LENGTH } from "@/constants/app-info";

export default function Comment({ postId, userId, isOwnPost }) {
  const [comment, setComment] = useState("");
  const [postComments, setPostComments] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    getPostComments();
  }, []);

  const handleCommentChange = (e) => {
    setButtonDisabled(e.target.value.length === 0);
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
    setErrorMessage("");
    if (comment.length > MAX_COMMENT_LENGTH) {
      setErrorMessage("Provided comment was too long");
      return;
    }

    if (!comment || comment.length === 0) {
      setErrorMessage("Provide comment content before sending it");
      return;
    }
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
    } catch (err) {
      setErrorMessage(err);
    }
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
        <Button
          label="Post comment"
          onClick={postComment}
          disabled={buttonDisabled}
        />
        <p className="text-red-500">{errorMessage}</p>
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
