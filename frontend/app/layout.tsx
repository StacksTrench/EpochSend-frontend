import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "EpochSend",
  description: "Intent-Based Conditional Payments on Stellar",
  icons: {
    icon: "/epochsend.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
          {children}
      </body>
    </html>
  );
}
