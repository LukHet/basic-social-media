export default function LoginPage() {
  return (
    <div>
      <main className="login-component flex flex-col max-w-screen-sm p-5 mx-auto">
        <label htmlFor="email">Email: </label>
        <input type="email" className="mt-1" name="email" id="email" />
        <label htmlFor="password" className="mt-5">
          Hasło:
        </label>
        <input type="password" className="mt-1" name="password" id="password" />
      </main>
    </div>
  );
}
