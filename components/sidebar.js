import Image from "next/image";
import ChatUsers from "./chat-users";

export default function SideBar() {
  return (
    <div className="fixed h-dvh main-page w-40 sidebar">
      <Image
        width={32}
        height={32}
        src={"/chat.png"}
        alt="chat"
        className="relative top-[5px] chat-icon mb-10"
      />
      <ChatUsers sidebar={true} />
    </div>
  );
}
