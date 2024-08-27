import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import { ThemeProvider } from "next-themes";
import { ModalProvider } from "@/providers/modal-provider";
import { cn } from "@/lib/utils";


import { Orbitron } from "next/font/google";
import { SocketProvider } from "@/providers/socket-provider";

const font = Orbitron({ subsets: ["latin"] });
//const font = Open_Sans({ subsets: ["latin"] });
//"bg-white dark:bg-[#313338]"
export const metadata: Metadata = {
  title: "Team Chat Application",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body className={cn(font.className,
        "bg-main-interface" )}   >
      <ThemeProvider
      attribute="class"
      defaultTheme="dark"
       enableSystem={false}
      storageKey="discord-theme">
        <SocketProvider>
       <ModalProvider />
        {children}
        </SocketProvider>
        </ThemeProvider>

        </body>
    </html>
    </ClerkProvider>
  );
}
