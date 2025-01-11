"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Button from "./button";
import TextInput from "./text-input";

export default function ProfileInfo() {
  const [userInfo, setUserInfo] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [mail, setMail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const getUserInfo = async () => {
    try {
      const response = await axios.get("http://localhost:8080/user-data", {
        withCredentials: true,
      });
      setUserInfo(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateUserInfo = async () => {
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
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    setMail(userInfo["email"] || "");
    setName(userInfo["name"] || "");
    setSurname(userInfo["surname"] || "");
    setBirthdate(userInfo["birthdate"] || "");
    setGender(userInfo["gender"] || "");
    setCity(userInfo["city"] || "");
    setCountry(userInfo["country"] || "");
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
      <div className="main-page mt-28 max-w-screen-sm p-5 rounded-3xl container mx-auto">
        <h1 className="text-center font-bold">Your Data</h1>
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
      <div className="flex flex-col">
        <Button
          label={isEditing ? "Quit editing your data" : "Edit your data"}
          onClick={handleClick}
        />
        {isEditing ? (
          <Button label="Update your data" onClick={updateUserInfo} />
        ) : null}
      </div>
    </>
  );
}
