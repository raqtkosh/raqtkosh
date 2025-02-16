"use client";

import { useEffect } from "react";

export default function ContactUsDialog({ onClose }: { onClose: () => void }) {
  // Close dialog after 30 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      onClose();
    }, 30000); // 30 seconds
    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-end z-40">
      {/* Dialog Box */}
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-2xl w-[400px] h-[400px] transform transition-transform duration-300 translate-x-0 dialog-box">
        {/* Content */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800 font-poppins">
          Contact Us
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          Have questions or need assistance? Reach out to us at:
        </p>
        <ul className="text-gray-600 text-sm">
          <li>Email: support@raqtkosh.com</li>
          <li>Phone: +91 12345 67890</li>
        </ul>
      </div>
    </div>
  );
}