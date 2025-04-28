"use client";
import { useState, useEffect, useRef } from "react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const chatbotRef = useRef<HTMLDivElement>(null); // Ref for the chatbot container

  // Close chatbot when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        chatbotRef.current &&
        !chatbotRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false); // Close the chatbot
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]); // Re-run effect when `isOpen` changes

  return (
    <div className="fixed bottom-4 right-4">
      {isOpen ? (
        <div
          ref={chatbotRef} // Attach the ref to the chatbot container
          className="w-80 h-[525px] bg-white shadow-lg rounded-lg flex flex-col" // Adjusted height to 525px (75% of 700px)
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
            style={{ height: "100%", minHeight: "525px" }} // Adjusted height to 525px (75% of 700px)
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