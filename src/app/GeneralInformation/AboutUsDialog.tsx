"use client";

import { useEffect } from "react";

export default function AboutUsDialog({ onClose }: { onClose: () => void }) {
  // Close dialog after 30 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      onClose();
    }, 30000); // 30 seconds
    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-end z-20">
      {/* Dialog Box */}
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-2xl w-[400px] h-[400px] transform transition-transform duration-300 translate-x-0 dialog-box flex items-center justify-center mr-4">
        {/* Centered Content */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 font-poppins">
            About RaqtKosh
          </h2>
          <p className="text-gray-600 text-sm max-w-[300px]">
            RaqtKosh is dedicated to facilitating easy and efficient blood donations. Our mission is to connect donors with those in need, ensuring a seamless and life-saving experience.
          </p>
        </div>
      </div>
    </div>
  );
}