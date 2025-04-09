"use client";

import { useState } from "react";
import FileInput from "./file-input";
import Button from "./button";
import { ALLOWED_FILE_EXTENSIONS } from "@/constants/app-info";

export default function PicturePopup({ onClose }) {
  const [file, setFile] = useState(null);
  const [fileSize, setFileSize] = useState(0);
  const [isUploadAllowed, setIsUploadAllowed] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setFileSize(event.target.files[0].size);
    const fileExtension = event.target.files[0].name.split(".")[1];

    if (ALLOWED_FILE_EXTENSIONS.includes(fileExtension)) {
      setIsUploadAllowed(true);
    }
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
        <div className="mx-auto mt-5">
          <FileInput
            handleFileChange={(e) => handleFileChange(e)}
            fileSize={fileSize}
          />
          <div className="flex justify-center mt-5">
            <Button label="Upload picture" disabled={!isUploadAllowed} />
          </div>
        </div>
      </div>
    </div>
  );
}
