"use client";

import { useEffect, useState } from "react";
import Post from "./post";
import { apiGetData } from "@/app/apiConnectors/apiGetData";

export default function SinglePost({ postId }) {
  const [post, setPost] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getSinglePost = async () => {
      try {
        const response = await apiGetData(
          "/single-post",
          { postId: postId },
          true
        );
        if (response?.data) {
          setPost(response.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const getUserData = async () => {
      try {
        const response = await apiGetData("/user-data", {}, true);
        setUserId(response?.data?.id);
      } catch (err) {
        console.log(err);
      }
    };

    getUserData();
    getSinglePost();
  }, []);

  return <div>{userId && post && <Post post={post} userId={userId} />}</div>;
}
