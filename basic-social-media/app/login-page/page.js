"use client";

import TextInput from "@/components/text-input";
import Button from "@/components/button";
import axios from "axios";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onButtonClick = async (e) => {
    e.preventDefault();
    await axios
      .post("http://localhost:8080/user-register", {
        email: email,
        password: password,
      })
      .then((res) => console.log(res));
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
            placeholder="password"
            label="Password"
            onChange={handlePasswordChange}
            value={password}
          />
          <Button label="Register" onClick={onButtonClick} />
        </form>
      </main>
    </div>
  );
}
