import Button from "./button";

export default async function Header() {
  return (
    <>
      <header className="flex justify-center">
        <nav className="top-0 border-solid rounded-3xl fixed border-b-black border-b-2 z-50 flex items-center justify-between flex-wrap p-6 header">
          <Button label="Main page" href="main-page" />
          <Button label="Chat" href="chat" />
          <Button label="Log in" href="login-page" />
        </nav>
      </header>
    </>
  );
}
