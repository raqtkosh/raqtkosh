"use client";

import { useState, useEffect } from "react"; // Import useEffect and useState
import { useRouter } from "next/navigation";
import Image from "next/image";
import AboutUsDialog from "../GeneralInformation/AboutUsDialog";
import ContactUsDialog from "../GeneralInformation/ContactUsDialog";
import SendSuggestionDialog from "../GeneralInformation/SendSuggestionDialog";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showAboutUs, setShowAboutUs] = useState(false);
  const [showContactUs, setShowContactUs] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);

  // Dummy login credentials
  const dummyCredentials = {
    email: "123456789",
    password: "123456789",
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true); // Show loading state

    // Simulate login with dummy credentials
    setTimeout(() => {
      if (
        formData.email === dummyCredentials.email &&
        formData.password === dummyCredentials.password
      ) {
        alert("Login Successful!");
        router.push("/dashboard"); // Redirect to dashboard after login
      } else {
        alert("Invalid email or password. Please try again.");
      }
      setIsLoading(false); // Hide loading state
    }, 1000); // Simulate a 1-second delay for API call
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Close dialog when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (showAboutUs || showContactUs || showSuggestion) &&
        !event.target.closest(".dialog-box")
      ) {
        setShowAboutUs(false);
        setShowContactUs(false);
        setShowSuggestion(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAboutUs, showContactUs, showSuggestion]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative">
      {/* Full-Page Background Image */}
      <Image
        src="/images/loginpageimage.webp" // Replace with your image path
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="z-0"
      />

      {/* Semi-Transparent Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>

      {/* Back Button on the Left Side */}
      <button
        onClick={() => router.push("/")} // Navigate back to the homepage
        className="absolute left-4 top-4 text-white hover:text-gray-300 z-30 flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back to Home
      </button>

      {/* Header with Navigation Links */}
      <div className="w-full flex justify-between items-center p-4 max-w-6xl mx-auto text-white z-30 absolute top-0">
        <h1 className="text-5xl font-bold font-barlow">RaqtKosh</h1>
        <nav className="flex gap-6">
          <button
            onClick={() => setShowAboutUs(true)}
            className="text-lg hover:underline"
          >
            About Us
          </button>
          <button
            onClick={() => setShowContactUs(true)}
            className="text-lg hover:underline"
          >
            Contact Us
          </button>
          <button
            onClick={() => setShowSuggestion(true)}
            className="text-lg hover:underline"
          >
            Send Suggestion
          </button>
        </nav>
      </div>

      {/* About Us Dialog */}
      {showAboutUs && <AboutUsDialog onClose={() => setShowAboutUs(false)} />}

      {/* Contact Us Dialog */}
      {showContactUs && <ContactUsDialog onClose={() => setShowContactUs(false)} />}

      {/* Send Suggestion Dialog */}
      {showSuggestion && <SendSuggestionDialog onClose={() => setShowSuggestion(false)} />}

      {/* Login Form */}
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-2xl z-20 w-full max-w-md border border-white/20">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 font-poppins">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Email/Phone Input */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2 text-gray-700">Email or Phone Number</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              placeholder="Enter your email or phone number"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all shadow-md"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
            <button
              type="button"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all shadow-md"
              onClick={() => router.push("/signup")}
            >
              New User? Register Here
            </button>
          </div>
        </form>

        {/* Forgot Password Link */}
        <div className="mt-4 text-center">
          <button
            onClick={() => router.push("/GeneralInformation/forgetpassword")} // Redirect to forgetpassword.tsx
            className="text-red-500 hover:underline"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
}