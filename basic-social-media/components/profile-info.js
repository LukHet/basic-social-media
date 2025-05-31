"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Button from "./button";
import TextInput from "./text-input";
import Image from "next/image";
import {
  APIURL,
  MAX_STRING_LENGTH,
  EMAIL_REGEX,
  GENDER_OPTIONS,
} from "@/constants/app-info";
import DateInput from "./date-input";
import SelectInput from "./select-input";
import countries from "@/constants/countries.json";
import PicturePopup from "./picture-popup";

export default function ProfileInfo({ isOwnProfile, slug }) {
  const [userInfo, setUserInfo] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [mail, setMail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);
  const [updateInfo, setUpdateInfo] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [countriesArray, setCountriesArray] = useState([]);
  const [isPicturePopupOpened, setIsPicturePopupOpened] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    let objectUrl;

    const getProfilePicture = async () => {
      try {
        const response = await axios.get(APIURL + "/get-picture", {
          params: { ownPicture: isOwnProfile, userId: slug },
          withCredentials: true,
        });
        if (response?.data?.content?.data) {
          const byteArray = new Uint8Array(response.data.content.data);
          const blob = new Blob([byteArray]);
          objectUrl = URL.createObjectURL(blob);
          setProfileImage(objectUrl);
        } else {
          setProfileImage("/picture_placeholder.png");
        }
      } catch (err) {
        console.error(err);
      }
    };

    getProfilePicture();
    setCountriesArray(countries.map((item) => item.country));

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, []);

  const getUserInfo = async () => {
    try {
      const response = isOwnProfile
        ? await axios.get(APIURL + "/user-data", {
            withCredentials: true,
          })
        : await axios.get(APIURL + "/other-user-data", {
            params: { otherUserId: slug },
            withCredentials: true,
          });
      setUserInfo(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateUserInfo = async (e) => {
    let newErrorMessages = [];

    if (!mail || !EMAIL_REGEX.test(mail)) {
      newErrorMessages.push("Provide valid email address!");
    }

    if (name.length === 0 || name.length > MAX_STRING_LENGTH) {
      newErrorMessages.push("Provide valid name!");
    }

    if (surname.length === 0 || surname.length > MAX_STRING_LENGTH) {
      newErrorMessages.push("Provide valid surname!");
    }

    if (!birthdate) {
      newErrorMessages.push("Provide valid birthdate!");
    }

    if (city.length === 0 || city.length > MAX_STRING_LENGTH) {
      newErrorMessages.push("Provide valid city!");
    }

    if (newErrorMessages.length > 0) {
      setErrorMessages(newErrorMessages);
      e.preventDefault();
      return;
    }

    try {
      const res = await axios.post(
        APIURL + "/update-user-data",
        {
          name: name,
          surname: surname,
          birthdate: birthdate,
          gender: gender,
          country: country,
          city: city,
          email: mail,
        },
        {
          withCredentials: true,
        }
      );
      setUpdateInfo("Your data has been changed!");
      getUserInfo();
    } catch (err) {
      if (err.response && err.response.data) {
        const message = err.response.data.message || "An error occurred";
        setErrorMessages((prevErrorMessages) => [
          ...prevErrorMessages,
          message + additionalMessage,
        ]);
      } else {
        setErrorMessages((prevErrorMessages) => [
          ...prevErrorMessages,
          "An unknown error occurred. Please try again later.",
        ]);
      }
    }
  };

  useEffect(() => {
    getUserInfo();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setMail(userInfo["email"] || "");
    setName(userInfo["name"] || "");
    setSurname(userInfo["surname"] || "");
    setBirthdate(userInfo["birthdate"] || "");
    setGender(userInfo["gender"] || "");
    setCity(userInfo["city"] || "");
    setCountry(userInfo["country"] || "");

    if (!isEditing) {
      setUpdateInfo("");
    }
  }, [isEditing]);

  const handleClick = () => {
    setIsEditing(!isEditing);
  };

  const handleMailChange = (e) => {
    setMail(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSurnameChange = (e) => {
    setSurname(e.target.value);
  };

  const handleBirthdateChange = (e) => {
    setBirthdate(e.target.value);
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
  };

  const handleInputsForEdit = (key) => {
    switch (key) {
      case "email":
        return (
          <TextInput
            key={key}
            value={mail}
            onChange={(e) => handleMailChange(e)}
          />
        );
      case "name":
        return (
          <TextInput
            key={key}
            value={name}
            onChange={(e) => handleNameChange(e)}
          />
        );
      case "surname":
        return (
          <TextInput
            key={key}
            value={surname}
            onChange={(e) => handleSurnameChange(e)}
          />
        );
      case "birthdate":
        return (
          <DateInput
            key={key}
            value={birthdate}
            onChange={(e) => handleBirthdateChange(e)}
          />
        );
      case "gender":
        return (
          <SelectInput
            key={key}
            options={GENDER_OPTIONS}
            value={gender}
            onChange={(e) => handleGenderChange(e)}
          />
        );
      case "city":
        return (
          <TextInput
            key={key}
            value={city}
            onChange={(e) => handleCityChange(e)}
          />
        );
      case "country":
        return (
          <SelectInput
            options={countriesArray}
            key={key}
            value={country}
            onChange={(e) => handleCountryChange(e)}
          />
        );
      default:
        return null;
    }
  };

  const openPicturePopup = () => {
    setIsPicturePopupOpened(true);
  };

  const closePicturePopup = () => {
    setIsPicturePopupOpened(false);
  };

  return (
    <>
      {isLoading ? null : (
        <>
          {isPicturePopupOpened ? (
            <PicturePopup onClose={closePicturePopup} />
          ) : null}
          <div className="main-page mt-28 max-w-screen-sm p-5 rounded-3xl container mx-auto">
            <div className="flex justify-between items-center">
              <h1 className="font-bold">Profile picture:</h1>
              <Image
                width={64}
                height={64}
                alt="Profile picture"
                src={profileImage ? profileImage : "/picture_placeholder.png"}
                className="rounded-full cursor-pointer"
                onClick={openPicturePopup}
              />
            </div>
            <h1 className="text-center font-bold">
              {isOwnProfile ? "Your Data" : "Profiles data"}
            </h1>
            {Object.keys(userInfo).map(
              (key) =>
                key !== "id" && (
                  <div
                    key={key}
                    className="flex justify-between mx-auto border-b-2 border-black p-1 items-center"
                  >
                    <p>{key}: </p>
                    {!isEditing ? (
                      <p>{userInfo[key]}</p>
                    ) : (
                      handleInputsForEdit(key)
                    )}
                  </div>
                )
            )}
          </div>
          {isOwnProfile ? (
            <>
              <div className="flex flex-col">
                {isEditing ? (
                  <Button
                    label="Update your data"
                    onClick={(e) => updateUserInfo(e)}
                  />
                ) : null}
                <Button
                  label={
                    isEditing ? "Quit editing your data" : "Edit your data"
                  }
                  onClick={handleClick}
                />
                <p className="text-center mt-2">{updateInfo}</p>
              </div>
              {errorMessages.length > 0 && (
                <div className="mt-5 text-center">
                  {errorMessages.map((message, id) => (
                    <p key={id} className="text-red-400">
                      {message}
                    </p>
                  ))}
                </div>
              )}
            </>
          ) : null}
        </>
      )}
    </>
  );
}
