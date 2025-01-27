"use client";

import Button from "./button";
import TextInput from "./text-input";
import { useState } from "react";
import axios from "axios";

export default function Comment({ postId }) {
  const [comment, setComment] = useState("");

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const postComment = async () => {
    console.log("posting comment");
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
      router.push("/main-page");
    } catch (err) {}
  };
  return (
    <div className="max-w-[50%] mt-5">
      <p>Add comment:</p>
      <div className="mt-2">
        <TextInput
          placeholder="Type your comment here..."
          onChange={handleCommentChange}
          value={comment}
        />
        <Button label="Post comment" onClick={postComment} />
      </div>
    </div>
  );
}
