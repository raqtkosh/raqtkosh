'use client';
import { Inter, Barlow } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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
  const [chatOpen, setChatOpen] = useState(false); // <-- Add this state

  useEffect(() => {
    setMounted(true);
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
            {/* Chat Bubble Button */}
            <button
  onClick={() => setChatOpen((prev) => !prev)}
  style={{
    position: "fixed",
    bottom: "40px",
    right: "40px",
    zIndex: 10000,
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "#E53935", // <-- more red!
    color: "#fff",
    border: "none",
    boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
    cursor: "pointer",
    fontSize: "2rem"
  }}
  aria-label="Open chat"
>
  💬
</button>
            {/* Chatbot - only show when open */}
            {chatOpen && (
              <div
                style={{
                  position: "fixed",
                  bottom: "110px", 
                  right: "40px",
                  zIndex: 9999,
                  width: "320px",
                  height: "525px",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
                  borderRadius: "16px",
                  overflow: "hidden",
                  background: "#fff"
                }}
              >
                <iframe
                  src="https://www.chatbase.co/chatbot-iframe/CZ5JPeKQN_MxdEQQRDFcg"
                  width="100%"
                  height="100%"
                  style={{ border: "none", minHeight: "525px" }}
                  title="RaqtKosh Chatbot"
                />
              </div>
            )}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}