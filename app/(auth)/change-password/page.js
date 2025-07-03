"use client";

import TextInput from "@/components/text-input";
import Button from "@/components/button";
import { useState, useEffect } from "react";
import {
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
  APIURL,
} from "@/constants/app-info";
import axios from "axios";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  const onOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
  };

  const onNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  useEffect(() => {
    if (
      newPassword.length >= MIN_PASSWORD_LENGTH &&
      newPassword.length <= MAX_PASSWORD_LENGTH &&
      oldPassword.length > 0
    ) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [newPassword, oldPassword]);

  const handleButtonClick = async () => {
    try {
      const res = await axios.post(
        APIURL + "/change-password",
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
        },
        {
          withCredentials: true,
        }
      );
      setStatusMessage(res?.data?.message);
    } catch (err) {
      setStatusMessage(err.response.data.message);
    }
  };

  return (
    <main>
      <div className="main-page mt-36 max-w-96 p-5 rounded-3xl container mx-auto">
        <div className="flex flex-col justify-center">
          <TextInput
            label="Old Password"
            type="password"
            placeholder="Your old password goes here..."
            value={oldPassword}
            onChange={onOldPasswordChange}
          />
          <TextInput
            label="New Password"
            type="password"
            placeholder="Your new password goes here..."
            value={newPassword}
            onChange={onNewPasswordChange}
          />
          <Button
            additionalClass="mt-5"
            label="Confirm password change"
            disabled={isButtonDisabled}
            onClick={handleButtonClick}
          />
          <p className="text-center mt-3">{statusMessage}</p>
        </div>
      </div>
    </main>
  );
}
