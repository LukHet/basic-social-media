"use client";

import { useState, useEffect } from "react";

export default function LikesPopup({ likes, showPopup }) {
  const [likesAuthors, setLikesAuthors] = useState([]);

  useEffect(() => {
    setLikesAuthors(likes);
  }, [likes]);

  return showPopup ? (
    <div className="absolute mt-10 border border-black rounded-md p-5 bg-gray-500/90 backdrop-opacity-10">
      {likesAuthors.map((el) => (
        <p key={el.id}>{el.author}</p>
      ))}
    </div>
  ) : null;
}
