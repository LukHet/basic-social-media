import "./globals.css";

export const metadata = {
  title: "Basic social media",
  description: "Connect with your friends!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
