import "../../globals.css";
import Header from "@/components/header";

export const metadata = {
  title: "Basic social media",
  description: "Connect with your friends!",
};

const inLoginButtonVisible = false;

export default function AuthRootLayout({ children }) {
  return (
    <>
      <Header inLoginButtonVisible={inLoginButtonVisible} />
      {children}
    </>
  );
}
