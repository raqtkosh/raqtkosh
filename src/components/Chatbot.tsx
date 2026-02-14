"use client";
import { useState, useEffect, useRef } from "react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const chatbotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        chatbotRef.current &&
        !chatbotRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="fixed bottom-10 left-10 z-50">
      {isOpen ? (
        <div
          ref={chatbotRef}
          className="w-80 h-[525px] bg-white shadow-lg rounded-lg flex flex-col"
        >
          <div className="p-4 bg-red-500 text-white rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold">RaqtKosh Chatbot</h3>
            <button onClick={() => setIsOpen(false)} className="text-white">
              ×
            </button>
          </div>
          <iframe
            src="https://www.chatbase.co/chatbot-iframe/CZ5JPeKQN_MxdEQQRDFcg" 
            width="100%"
            style={{ height: "100%", minHeight: "525px" }}
            frameBorder="0"
          />
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-full shadow-lg hover:from-red-600 hover:to-pink-600 transition-all"
        >
          💬
        </button>
      )}
    </div>
  );
}