import Link from "next/link";

export default function Header() {
  return (
    <>
      <header>
        <nav className="top-0 border-solid fixed border-b-black border-b-2 w-screen z-50 flex items-center justify-between flex-wrap p-6 header">
          <Link href="main-page">Strona główna</Link>
          <p>Chat</p>
          <Link href="login-page">Zaloguj się</Link>
        </nav>
      </header>
    </>
  );
}
