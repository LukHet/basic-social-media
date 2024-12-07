"use client";

import TextInput from "@/components/text-input";
import Button from "@/components/button";
import axios from "axios";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);

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
    await axios
      .post("http://localhost:8080/user-register", {
        email: email,
        password: password,
      })
      .then((res) => console.log(res))
      .catch((err) => {
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
          return;
        }
        setErrorMessages((prevErrorMessages) => [
          ...prevErrorMessages,
          "An unknown error occurred. Please try again later.",
        ]);
      });
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div>
      <main>
        <form className="login-component flex flex-col max-w-screen-sm p-5 mx-auto mt-5 rounded-lg mt-5">
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
