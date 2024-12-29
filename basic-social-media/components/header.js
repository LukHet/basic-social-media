import Button from "./button";

export default function Header({ inLoginButtonVisible }) {
  return (
    <>
      <header className="flex justify-center">
        <nav className="top-0 border-solid rounded-3xl fixed border-b-black border-b-2 z-50 flex items-center justify-between flex-wrap p-6 header">
          <Button label="Main page" href="main-page" />
          <Button label="Chat" href="chat" />
          {inLoginButtonVisible ? (
            <Button label="Log in" href="login-page" />
          ) : (
            <Button label="Log out" href="log-out" />
          )}
        </nav>
      </header>
    </>
  );
}
