import Chat from "@/components/chat";

export default async function ChatPage({ params }) {
  const chatParameters = await params;

  return (
    <>
      <Chat chatParameters={chatParameters} />
    </>
  );
}
