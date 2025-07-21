"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { APIURL } from "@/constants/app-info";
import Post from "./post";

export default function SinglePost({ postId }) {
  const [post, setPost] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getSinglePost = async () => {
      try {
        const response = await axios.get(APIURL + "/single-post", {
          params: { postId: postId },
          withCredentials: true,
        });
        if (response?.data) {
          setPost(response.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const getUserData = async () => {
      try {
        const response = await axios.get(APIURL + "/user-data", {
          withCredentials: true,
        });
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
