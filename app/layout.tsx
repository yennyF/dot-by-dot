import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dot by Dot",
  description: "A lightweight place to track tasks and habits",
  icons: {
    icon: [
      // { url: "/favicon.ico", sizes: "any" }, // Fallback for browsers that don't support SVG
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <ToastContainer autoClose={false} draggable={false} />
        {/* {process.env.NODE_ENV === "development" && <TestModeTag />} */}
      </body>
    </html>
  );
}
