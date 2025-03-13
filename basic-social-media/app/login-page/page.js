"use client";

import TextInput from "@/components/text-input";
import Button from "@/components/button";
import axios from "axios";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { APIURL } from "@/constants/app-info";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);
  const router = useRouter();

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
        "Provide a valid password!",
      ]);
    }

    if (errorMessages.length > 0) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    await axios
      .post(
        APIURL + "/user-login",
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => router.push("/main-page"))
      .catch((err) => {
        if (err.response && err.response.data) {
          const message = err.response.data.message || "An error occurred";

          setErrorMessages((prevErrorMessages) => [
            ...prevErrorMessages,
            message,
          ]);
        } else {
          setErrorMessages((prevErrorMessages) => [
            ...prevErrorMessages,
            "An unknown error occurred. Please try again later.",
          ]);
        }
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
          <Button label="Login" onClick={onButtonClick} />
          <div className="flex mx-auto mt-5">
            <p>
              Don't have an account yet?
              <Link href="/register-page" className="text-blue-700 underline">
                {" "}
                Register
              </Link>
            </p>
          </div>
          {errorMessages.length > 0 && (
            <div>
              {errorMessages.map((message, id) => (
                <p key={id} className="text-red-500">
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
