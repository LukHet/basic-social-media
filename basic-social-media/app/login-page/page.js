import TextInput from "@/components/text-input";
import Button from "@/components/button";

export default function LoginPage() {
  return (
    <div>
      <main>
        <form className="login-component flex flex-col max-w-screen-sm p-5 mx-auto mt-5 rounded-lg mt-5">
          <TextInput
            id="usermail"
            type="mail"
            placeholder="E-mail"
            label="E-mail"
          />
          <TextInput
            id="userpassword"
            type="password"
            placeholder="password"
            label="Password"
          />
          <Button label="Register" />
        </form>
      </main>
    </div>
  );
}
