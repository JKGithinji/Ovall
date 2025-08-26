import "../styles/globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "News Swipe",
  description: "Swipe through news and see if you match the crowd!",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">{children}</body>
    </html>
  );
}