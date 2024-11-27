import "../globals.css";
import { Inter } from "next/font/google";

export const metadata = {
  title: "Basic social media",
  description: "Connect with your friends!",
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
