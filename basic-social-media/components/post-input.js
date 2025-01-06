"use client";

import { useState } from "react";
import axios from "axios";
import TextArea from "./text-area";
import Button from "./button";

export default function PostInput() {
  const [postValue, setPostValue] = useState("");
  const [postInfo, setPostInfo] = useState("");

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
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <TextArea
        label="Add new post:"
        id="publish-post"
        value={postValue}
        onChange={onPostValueChange}
      />
      <Button label="Publish" onClick={sendNewPost} />
      <p className="mt-2">{postInfo}</p>
    </>
  );
}
