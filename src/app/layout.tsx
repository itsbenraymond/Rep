import type { Metadata } from "next";
import type { Viewport } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rep",
  description: "Mobile-first gym logging and progression tracker.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#050505]">
        <ClerkProvider>
          <header className="fixed right-3 top-3 z-20 flex h-11 items-center gap-2 rounded-full border border-white/10 bg-black/60 px-2 backdrop-blur-xl">
            <SignInButton>
              <span className="rounded-full px-3 py-2 text-xs font-black text-[#f4f1ec]">Sign in</span>
            </SignInButton>
            <SignUpButton>
              <span className="rounded-full bg-[#d7ff49] px-3 py-2 text-xs font-black text-black">Sign up</span>
            </SignUpButton>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
