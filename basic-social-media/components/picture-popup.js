"use client";

import { useState } from "react";
import FileInput from "./file-input";

export default function PicturePopup({ onClose }) {
  const [file, setFile] = useState(null);
  const [fileSize, setFileSize] = useState(0);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setFileSize(event.target.files[0].size);
  };
  return (
    <div className="fixed inset-0 z-50 pt-24 w-full h-full overflow-auto bg-black bg-opacity-40">
      <div className="main-page min-w-80 h-80 rounded-3xl p-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div
          className="cursor-pointer w-fit p-1 border-2 border-black float-right relative rounded-3xl"
          onClick={onClose}
        >
          X
        </div>
        <h1 className="font-bold text-center mt-5">
          Upload your profile picture:
        </h1>
        <FileInput
          handleFileChange={(e) => handleFileChange(e)}
          fileSize={fileSize}
        />
      </div>
    </div>
  );
}
