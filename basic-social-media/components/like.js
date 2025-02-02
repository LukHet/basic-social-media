"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

export default function Like({ postId }) {
  const [imgSrc, setImgSrc] = useState("/heart.png");
  const [likes, setLikes] = useState([]);

  const setImgToLiked = () => {
    setImgSrc("/heart_liked.png");
  };

  const setImgToNotLiked = () => {
    setImgSrc("/heart.png");
  };

  useEffect(() => {
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

    getLikes();
  }, []);

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
      />
      <p>{likes ? likes.length : 0}</p>
    </div>
  );
}
