"use client";

import TextInput from "./text-input";
import Button from "./button";
import { useEffect, useState } from "react";
import { socket } from "@/app/socket";
import { apiPostData } from "@/app/apiConnectors/apiPostData";
import { apiGetData } from "@/app/apiConnectors/apiGetData";

export default function Chat({ chatParameters }) {
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [transport, setTransport] = useState("N/A");
  const [allMessages, setAllMessages] = useState([]);
  const [senderId, setSenderId] = useState(null);
  const receiverId = chatParameters.slug.split("-")[1];

  useEffect(() => {
    getUsersId();
    getMessages();

    const onConnect = () => {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);
    };

    const onDisconnect = () => {
      setIsConnected(false);
      setTransport("N/A");
    };

    const onReceive = (message) => {
      handleSocketMessage(message);
    };

    if (socket.connected) {
      onConnect();
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("receive", onReceive);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("receive", onReceive);
    };
  }, []);

  const getUsersId = async () => {
    try {
      const response = await apiGetData("/user-data", {}, true);
      setSenderId(response?.data?.id);
    } catch (err) {
      console.error(err);
    }
  };

  const getMessages = async () => {
    try {
      const response = await apiGetData(
        "/chat-messages",
        { senderId: senderId, receiverId: receiverId },
        true
      );
      setAllMessages(response?.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSocketMessage = (message) => {
    if (!message) return;
    setAllMessages((prev) => [...prev, message]);
  };

  const sendMessage = async () => {
    const currentDate = new Date();
    const formattedCurrentDate = currentDate
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    try {
      await apiPostData(
        "/send-message",
        {
          receiverId: receiverId,
          senderId: senderId,
          content: message,
          messageDate: formattedCurrentDate,
        },
        true
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
      await sendMessage();
      socket.emit("send", { receiverId, message });
      setMessage("");
    }
  };

  const handleEnterClick = (e) => {
    if (e.key === "Enter") {
      handleSendClick();
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
          onKeyDown={(e) => handleEnterClick(e)}
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
