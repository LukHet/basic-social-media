"use client";

import Button from "./button";
import TextInput from "./text-input";
import { useState } from "react";

export default function Comment() {
  const [comment, setComment] = useState("");

  const handleCommentChange = (e) => {
    setComment(e.target.value);
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
        <Button label="Post comment" />
      </div>
    </div>
  );
}
