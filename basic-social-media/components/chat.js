"use client";

import TextInput from "./text-input";
import Button from "./button";
import { useEffect, useState } from "react";
import { socket } from "@/app/socket";

export default function Chat({ chatParameters }) {
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [transport, setTransport] = useState("N/A");
  const senderId = chatParameters.slug.split("-")[0];
  const receiverId = chatParameters.slug.split("-")[1];

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    };

    const onDisconnect = () => {
      setIsConnected(false);
      setTransport("N/A");
    };

    if (socket.connected) {
      onConnect();
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    const handleReceivingMessage = (message) => {
      console.log("received message", message);
    };

    socket.on("receive", handleReceivingMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("receive", handleReceivingMessage);
    };
  }, []);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendClick = () => {
    if (message.trim()) {
      socket.emit("send", { senderId, receiverId, message });
      setMessage("");
    }
  };

  return (
    <>
      <div className="main-page mt-28 max-w-screen-lg p-5 rounded-3xl container mx-auto h-[70vh]">
        <p className="text-center font-bold">
          {isConnected ? "Connected to chat!" : "Couldn't connect to chat"}
        </p>
      </div>
      <div className="main-page fixed w-full max-w-screen-lg bottom-0 fixed-centered left-[50%] flex">
        <TextInput
          additionalClass={"w-[90%]"}
          value={message}
          onChange={(e) => handleMessageChange(e)}
        />
        <Button
          label="Send"
          additionalClass={"w-[10%] h-[40px] !mt-0"}
          onClick={handleSendClick}
        />
      </div>
    </>
  );
}
