"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import LikesPopup from "./likes-popup";
import { APIURL } from "@/constants/app-info";

export default function Like({ postId, userId }) {
  const [imgSrc, setImgSrc] = useState("/heart.png");
  const [likes, setLikes] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

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
          APIURL + "/delete-like",
          {
            postId: postId,
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
        APIURL + "/post-like",
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
      const response = await axios.get(APIURL + "/get-likes", {
        params: { postId: postId },
        withCredentials: true,
      });
      setLikes(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMouseOverNumber = () => {
    setShowPopup(true);
  };

  const handleMouseNotOverNumber = () => {
    setShowPopup(false);
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
        onMouseEnter={setImgToLiked}
        onMouseLeave={setImgToNotLiked}
        onClick={handleHeartClick}
      />
      <div
        onMouseEnter={handleMouseOverNumber}
        onMouseLeave={handleMouseNotOverNumber}
      >
        <p className="text-xl">Likes: {likes ? likes.length : 0}</p>
      </div>
      {likes && likes.length ? (
        <LikesPopup likes={likes} showPopup={showPopup} />
      ) : null}
    </div>
  );
}
