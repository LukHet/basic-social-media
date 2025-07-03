import ChatUsers from "@/components/chat-users";

export default function ChatPage() {
  return (
    <div className="main-page mt-28 max-w-screen-lg p-5 rounded-3xl container mx-auto">
      <h1 className="text-center font-bold">Available users to chat:</h1>
      <ChatUsers sidebar={false} />
    </div>
  );
}
