"use client";

import { useState, useEffect } from "react";
import { ChangeEvent, FormEvent } from "react";

export default function SendSuggestionDialog({ onClose }: { onClose: () => void }) {
  const [suggestionData, setSuggestionData] = useState({
    name: "",
    email: "",
    suggestion: "",
  });

  // Close dialog after 30 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      onClose();
    }, 30000); // 30 seconds
    return () => clearTimeout(timeout);
  }, [onClose]);

  // Handle input changes
  const handleSuggestionChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSuggestionData({ ...suggestionData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Suggestion Data:", suggestionData);
    alert("Thank you for your suggestion!");
    onClose(); // Close the dialog
  };

  return (
    <div className="fixed inset-0 flex items-center justify-end z-40">
      {/* Dialog Box */}
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-2xl w-[400px] h-[400px] transform transition-transform duration-300 translate-x-0 dialog-box">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 font-poppins">
          Send Suggestion
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={suggestionData.name}
              onChange={handleSuggestionChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              placeholder="Enter your name"
              required
            />
          </div>
          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700">Email ID</label>
            <input
              type="email"
              name="email"
              value={suggestionData.email}
              onChange={handleSuggestionChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              placeholder="Enter your email"
              required
            />
          </div>
          {/* Suggestion Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700">Suggestion</label>
            <textarea
              name="suggestion"
              value={suggestionData.suggestion}
              onChange={handleSuggestionChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
              rows={1} // Limit to 2 lines
              placeholder="Enter your suggestion"
              required
            ></textarea>
          </div>
          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all shadow-md text-sm"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
