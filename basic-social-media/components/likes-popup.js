"use client";

import { useState, useEffect } from "react";

export default function LikesPopup({ likes, showPopup }) {
  const [likesAuthors, setLikesAuthors] = useState([]);

  useEffect(() => {
    setLikesAuthors(likes);
  }, []);

  return showPopup ? (
    <div className="absolute p-10 bg-gray-500/90 backdrop-opacity-10">
      {likesAuthors.map((el) => (
        <p key={el.id}>{el.author}</p>
      ))}
    </div>
  ) : null;
}
