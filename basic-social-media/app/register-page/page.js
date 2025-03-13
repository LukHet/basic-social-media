"use client";

import TextInput from "@/components/text-input";
import Button from "@/components/button";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DateInput from "@/components/date-input";
import SelectInput from "@/components/select-input";
import countries from "../../constants/countries.json";
import { APIURL } from "@/constants/app-info";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("none");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("none");
  const [countriesArray, setCountriesArray] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);
  const router = useRouter();
  const GENDER_OPTIONS = ["man", "female", "other"];

  useEffect(() => {
    setCountriesArray(countries.map((item) => item.country));
  }, []);

  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const onButtonClick = async (e) => {
    setErrorMessages([]);

    if (!email || !emailRegex.test(email)) {
      setErrorMessages((prevErrorMessages) => [
        ...prevErrorMessages,
        "Provide valid email address!",
      ]);
    }

    if (name.length === 0) {
      setErrorMessages((prevErrorMessages) => [
        ...prevErrorMessages,
        "Provide valid name!",
      ]);
    }

    if (surname.length === 0) {
      setErrorMessages((prevErrorMessages) => [
        ...prevErrorMessages,
        "Provide valid surname!",
      ]);
    }

    if (!birthdate) {
      setErrorMessages((prevErrorMessages) => [
        ...prevErrorMessages,
        "Provide valid birthdate!",
      ]);
    }

    if (city.length === 0) {
      setErrorMessages((prevErrorMessages) => [
        ...prevErrorMessages,
        "Provide valid city!",
      ]);
    }

    if (!password || password.length < 8 || password.length > 64) {
      setErrorMessages((prevErrorMessages) => [
        ...prevErrorMessages,
        "Provide a valid password longer than 8 characters!",
      ]);
    }

    if (errorMessages.length > 0) {
      e.preventDefault();
      return;
    }

    e.preventDefault();

    try {
      const res = await axios.post(
        APIURL + "/user-register",
        {
          name: name,
          surname: surname,
          birthdate: birthdate,
          gender: gender,
          country: country,
          city: city,
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      );
      router.push("/main-page");
    } catch (err) {
      if (err.response && err.response.data) {
        const message = err.response.data.message || "An error occurred";
        const additionalMessage =
          err.response.data.err &&
          err.response.data.err.code === "SQLITE_CONSTRAINT_UNIQUE"
            ? "It seems like an account for the chosen email already exists."
            : "";

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

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
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

  return (
    <div>
      <main>
        <form className="login-component flex flex-col max-w-screen-sm p-5 mx-auto rounded-lg">
          <TextInput
            id="name"
            type="text"
            placeholder="Name"
            label="Name"
            onChange={handleNameChange}
            value={name}
          />
          <TextInput
            id="surname"
            type="text"
            placeholder="Surname"
            label="Surname"
            onChange={handleSurnameChange}
            value={surname}
          />
          <DateInput
            id="birthdate"
            placeholder="Birthdate"
            label="Birthdate"
            value={birthdate}
            onChange={handleBirthdateChange}
          />
          <SelectInput
            id="gender"
            placeholder="Gender"
            label="Gender"
            options={GENDER_OPTIONS}
            value={gender}
            onChange={handleGenderChange}
          />
          <SelectInput
            id="country"
            placeholder="Country"
            label="Country"
            options={countriesArray}
            value={country}
            onChange={handleCountryChange}
          />
          <TextInput
            id="city"
            type="text"
            placeholder="City"
            label="City"
            onChange={handleCityChange}
            value={city}
          />
          <TextInput
            id="usermail"
            type="mail"
            placeholder="E-mail"
            label="E-mail"
            onChange={handleEmailChange}
            value={email}
          />
          <TextInput
            id="userpassword"
            type="password"
            placeholder="Password"
            label="Password"
            onChange={handlePasswordChange}
            value={password}
          />
          <Button label="Register" onClick={onButtonClick} />

          {errorMessages.length > 0 && (
            <div className="mt-5">
              {errorMessages.map((message, id) => (
                <p key={id} className="text-red-400">
                  {message}
                </p>
              ))}
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
