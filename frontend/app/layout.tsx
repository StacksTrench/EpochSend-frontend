import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/contexts/WalletContext";

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
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
