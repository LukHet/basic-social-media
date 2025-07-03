"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { APIURL } from "@/constants/app-info";

export default function CommentLike({ commentId, userId }) {
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
    if (isLiked) {
      try {
        const response = await axios.post(
          APIURL + "/delete-comment-like",
          {
            commentId: commentId,
          },
          { withCredentials: true }
        );
        setIsLiked(false);
        getLikes();
        setImgSrc("/heart.png");
      } catch (err) {
        console.error(err);
      }
      return;
    }

    try {
      const response = await axios.post(
        APIURL + "/comment-like",
        {
          commentId: commentId,
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
      const response = await axios.get(APIURL + "/get-comment-likes", {
        params: { commentId: commentId },
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
        width={28}
        height={28}
        alt="heart"
        className="heart mr-2"
        onMouseEnter={setImgToLiked}
        onMouseLeave={setImgToNotLiked}
        onClick={handleHeartClick}
      />
      <div>
        <p className="text-base">Likes: {likes ? likes.length : 0}</p>
      </div>
    </div>
  );
}
