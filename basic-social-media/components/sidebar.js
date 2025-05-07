import Image from "next/image";

export default function SideBar() {
  return (
    <div className="absolute h-dvh main-page w-40 sidebar">
      <Image
        width={32}
        height={32}
        src={"/chat.png"}
        alt="chat"
        className="relative left-[70%] top-[5px]"
      />
    </div>
  );
}
