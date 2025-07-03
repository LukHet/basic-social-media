"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import LikesTooltip from "./likes-popup";
import { APIURL } from "@/constants/app-info";
import PostLikesPopup from "./post-likes-popup";

export default function Like({ postId, userId }) {
  const [imgSrc, setImgSrc] = useState("/heart.png");
  const [likes, setLikes] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);

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
    setShowTooltip(true);
  };

  const handleMouseNotOverNumber = () => {
    setShowTooltip(false);
  };

  const handleLikesClick = () => {
    setPopupOpen(true);
  };

  const handlePopupClose = () => {
    setPopupOpen(false);
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
        onClick={handleLikesClick}
        className="cursor-pointer"
      >
        <p className="text-xl">Likes: {likes ? likes.length : 0}</p>
      </div>
      {likes && likes.length ? (
        <LikesTooltip likes={likes} showTooltip={showTooltip} />
      ) : null}
      {likes && likes.length && popupOpen ? (
        <PostLikesPopup likes={likes} closePopup={handlePopupClose} />
      ) : null}
    </div>
  );
}
