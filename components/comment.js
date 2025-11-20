"use client";

import Button from "./button";
import TextInput from "./text-input";
import { useState, useEffect } from "react";
import PostComments from "./post-comments";
import { MAX_COMMENT_LENGTH } from "@/constants/app-info";
import { apiPostData } from "@/app/apiConnectors/apiPostData";
import { apiGetData } from "@/app/apiConnectors/apiGetData";

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
      const res = await apiGetData("/get-comments", { postId: postId }, true);
      setPostComments(res?.data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await apiPostData(
        "/delete-comment",
        {
          commentId: commentId,
        },
        true
      );
      await getPostComments();
    } catch (err) {
      console.log(err);
    }
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
      await apiPostData(
        "/post-comment",
        {
          content: comment,
          postId: postId,
          comment_date: formattedCurrentDate,
        },
        true
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
