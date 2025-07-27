"use client";

import { useState } from "react";
import FileInput from "./file-input";
import Button from "./button";
import {
  ALLOWED_FILE_EXTENSIONS,
  APIURL,
  MAX_FILE_SIZE,
} from "@/constants/app-info";
import Image from "next/image";
import axios from "axios";

export default function PicturePopup({ onClose }) {
  const [file, setFile] = useState(null);
  const [fileSize, setFileSize] = useState(0);
  const [isUploadAllowed, setIsUploadAllowed] = useState(false);
  const [imageURL, setImageURL] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setFileSize(selectedFile.size);
    const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
    const isFileAllowed =
      ALLOWED_FILE_EXTENSIONS.includes(fileExtension) &&
      selectedFile.size < MAX_FILE_SIZE;
    setIsUploadAllowed(isFileAllowed);
    if (isFileAllowed) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setImageURL(objectUrl);
    } else {
      setErrorMessage("Only jpg, jpeg and png files up to 5MB are allowed!");
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleUploadPicture = async () => {
    if (!file) return;
    const base64DataUrl = await toBase64(file);
    try {
      const res = await axios.post(
        APIURL + "/post-picture",
        { content: base64DataUrl },
        {
          withCredentials: true,
        }
      );
      setErrorMessage("New profile picture has been uploaded!");
      window.location.reload();
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Unknown error";

      setErrorMessage("Couldn't upload the picture: " + message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 pt-24 w-full h-full overflow-auto bg-black bg-opacity-40">
      <div className="main-page min-w-80 h-fit min-h-80 rounded-3xl p-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
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
          {imageURL && (
            <div className="relative w-full aspect-[4/3] mt-4">
              <Image
                src={imageURL}
                alt="Your profile picture"
                fill
                className="object-contain rounded-lg"
              />
            </div>
          )}
          <div className="flex justify-center mt-5 mb-3">
            <Button
              label="Upload picture"
              disabled={!isUploadAllowed}
              onClick={() => handleUploadPicture()}
            />
          </div>
          <div>
            <p className="mt-3 max-w-80">{errorMessage}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
