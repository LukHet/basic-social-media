"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Button from "./button";
import TextInput from "./text-input";

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
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const getUserInfo = async () => {
    try {
      const response = isOwnProfile
        ? await axios.get("http://localhost:8080/user-data", {
            withCredentials: true,
          })
        : await axios.get("http://localhost:8080/other-user-data", {
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

    if (!mail || !emailRegex.test(mail)) {
      newErrorMessages.push("Provide valid email address!");
    }

    if (name.length === 0) {
      newErrorMessages.push("Provide valid name!");
    }

    if (surname.length === 0) {
      newErrorMessages.push("Provide valid surname!");
    }

    if (!birthdate) {
      newErrorMessages.push("Provide valid birthdate!");
    }

    if (city.length === 0) {
      newErrorMessages.push("Provide valid city!");
    }

    if (newErrorMessages.length > 0) {
      setErrorMessages(newErrorMessages);
      e.preventDefault();
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/update-user-data",
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
          <TextInput
            key={key}
            value={birthdate}
            onChange={(e) => handleBirthdateChange(e)}
          />
        );
      case "gender":
        return (
          <TextInput
            key={key}
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
          <TextInput
            key={key}
            value={country}
            onChange={(e) => handleCountryChange(e)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {isLoading ? null : (
        <>
          <div className="main-page mt-28 max-w-screen-sm p-5 rounded-3xl container mx-auto">
            <h1 className="text-center font-bold">
              {isOwnProfile ? "Your Data" : "Profiles data"}
            </h1>
            {Object.keys(userInfo).map((key) => (
              <div
                key={key}
                className="flex justify-between mx-auto border-b-2 border-black p-1 items-center"
              >
                <p>{key}: </p>
                {!isEditing ? <p>{userInfo[key]}</p> : handleInputsForEdit(key)}
              </div>
            ))}
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
