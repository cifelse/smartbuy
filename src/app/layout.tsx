import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartBuy",
  description: "Your Trusted Tindahan Online—Shop Smart, Save Big, Live Better!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}>
        {children}
      </body>
    </html>
  );
}
