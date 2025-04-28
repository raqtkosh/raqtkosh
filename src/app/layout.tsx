'use client';
import { Inter, Barlow } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Chatbot from "@/components/Chatbot";
import { ClerkProvider } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
const interFont = Inter({ subsets: ["latin"] });
const barlowFont = Barlow({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-barlow",
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.id = "CZ5JPeKQN_MxdEQQRDFcg";
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!mounted) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className={`${interFont.className} ${barlowFont.variable} flex items-center justify-center h-screen`}>
          <Loader2 className="w-8 h-8 animate-spin" />
        </body>
      </html>
    );
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${interFont.className} ${barlowFont.variable}`}>
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Chatbot />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}