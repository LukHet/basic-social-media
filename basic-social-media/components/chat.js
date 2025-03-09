"use client";

import TextInput from "./text-input";
import Button from "./button";
import { useEffect, useState } from "react";
import { socket } from "@/app/socket";
import axios from "axios";

export default function Chat({ chatParameters }) {
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [transport, setTransport] = useState("N/A");
  const [allMessages, setAllMessages] = useState([]);
  const senderId = chatParameters.slug.split("-")[0];
  const receiverId = chatParameters.slug.split("-")[1];

  useEffect(() => {
    getMessages();
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

    socket.on("receive", (message) => {
      console.log("received something ", message);
      handleSocketMessage(message);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("receive", handleReceivingMessage);
    };
  }, []);

  const getMessages = async () => {
    try {
      const response = await axios.get("http://localhost:8080/chat-messages", {
        params: { senderId: senderId, receiverId: receiverId },
        withCredentials: true,
      });
      setAllMessages(response?.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSocketMessage = async (message) => {
    if (!message) return;
    const currentDate = new Date();
    const formattedCurrentDate = currentDate
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    try {
      const res = await axios.post(
        "http://localhost:8080/send-message",
        {
          receiverId: message.receiverId,
          senderId: message.senderId,
          content: message.message,
          messageDate: formattedCurrentDate,
        },
        {
          withCredentials: true,
        }
      );
      await getMessages();
    } catch (err) {
      console.log(err);
    }
  };

  const sendMessage = async (commentId) => {
    const currentDate = new Date();
    const formattedCurrentDate = currentDate
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    try {
      const res = await axios.post(
        "http://localhost:8080/send-message",
        {
          receiverId: receiverId,
          senderId: senderId,
          content: message,
          messageDate: formattedCurrentDate,
        },
        {
          withCredentials: true,
        }
      );
      await getMessages();
    } catch (err) {
      console.log(err);
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendClick = async () => {
    if (message.trim()) {
      socket.emit("send", { senderId, receiverId, message });
      setMessage("");
      await sendMessage();
    }
  };

  return (
    <>
      <div className="main-page mt-28 max-w-screen-lg p-5 rounded-3xl container mx-auto h-[70vh]">
        <p className="text-center font-bold">
          {isConnected ? "Connected to chat!" : "Couldn't connect to chat"}
        </p>
        <div className="overflow-y-auto h-full flex flex-col">
          {allMessages && allMessages.length > 0
            ? allMessages.map((mess) => (
                <div
                  key={mess.id}
                  className={`button p-3 m-2 w-fit rounded-3xl ${
                    mess.sender_id === Number(senderId)
                      ? "text-end ml-auto"
                      : "text-start mr-auto"
                  }`}
                >
                  <p className="text-xs">{mess.message_date}</p>
                  <h2 className="text-base">{mess.content}</h2>
                </div>
              ))
            : null}
        </div>
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
