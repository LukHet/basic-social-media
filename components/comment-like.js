"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { apiPostData } from "@/app/apiConnectors/apiPostData";
import { apiGetData } from "@/app/apiConnectors/apiGetData";

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
        await apiPostData(
          "/delete-comment-like",
          {
            commentId: commentId,
          },
          true
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
      await apiPostData(
        "/comment-like",
        {
          commentId: commentId,
        },
        true
      );
      setIsLiked(true);
      getLikes();
    } catch (err) {
      console.error(err);
    }
  };

  const getLikes = async () => {
    try {
      const response = await apiGetData(
        "/get-comment-likes",
        { commentId: commentId },
        true
      );
      setLikes(response?.data);
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
