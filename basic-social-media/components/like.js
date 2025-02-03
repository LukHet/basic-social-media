"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

export default function Like({ postId, userId }) {
  const [imgSrc, setImgSrc] = useState("/heart.png");
  const [likes, setLikes] = useState([]);
  const [isLiked, setIsLiked] = useState(false);

  const setImgToLiked = () => {
    if (isLiked) return;
    setImgSrc("/heart_liked.png");
  };

  const setImgToNotLiked = () => {
    if (isLiked) return;
    setImgSrc("/heart.png");
  };

  const handleHeartClick = async () => {
    if (isLiked) return;
    try {
      const response = await axios.post(
        "http://localhost:8080/post-like",
        {
          postId: postId,
        },
        { withCredentials: true }
      );
      setIsLiked(true);
      getLikes();
    } catch (err) {
      console.error(err);
    }
  };

  const getLikes = async () => {
    try {
      const response = await axios.get("http://localhost:8080/get-likes", {
        params: { postId: postId },
        withCredentials: true,
      });
      setLikes(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getLikes();
  }, []);

  useEffect(() => {
    likes.forEach((el) => {
      if (el.user_id === userId) {
        setIsLiked(true);
        setImgToLiked();
      }
    });
  }, [likes]);

  return (
    <div className="flex mt-5">
      <Image
        src={imgSrc}
        width={32}
        height={32}
        alt="heart"
        className="heart mr-2"
        onMouseOver={setImgToLiked}
        onMouseOut={setImgToNotLiked}
        onClick={handleHeartClick}
      />
      <p>{likes ? likes.length : 0}</p>
    </div>
  );
}
