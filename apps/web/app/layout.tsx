import { ReactNode } from "react";
import { Metadata } from "next";

import AppProvider from "@providers/app-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Real ChatGPT Assignment",
  description: "Minimal ChatGPT-like",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
