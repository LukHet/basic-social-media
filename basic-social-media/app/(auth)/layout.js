import Header from "@/components/header";
import SideBar from "@/components/sidebar";

export const metadata = {
  title: "Basic social media",
  description: "Connect with your friends!",
};

const inLoginButtonVisible = false;

export default function AuthRootLayout({ children }) {
  return (
    <>
      <Header inLoginButtonVisible={inLoginButtonVisible} />
      <SideBar />
      {children}
    </>
  );
}
