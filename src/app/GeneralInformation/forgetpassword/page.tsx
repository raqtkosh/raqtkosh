"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ForgetPassword() {
  const router = useRouter();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Enter email/phone, 2: Enter code, 3: Reset password
  const [error, setError] = useState("");

  // Validate email or phone number
  const validateEmailOrPhone = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
    const phoneRegex = /^\d{10}$/; // 10-digit phone number

    if (emailRegex.test(input)) {
      return "email";
    } else if (phoneRegex.test(input)) {
      return "phone";
    } else {
      return "invalid";
    }
  };

  // Handle sending verification code
  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");

    // Validate input
    if (!emailOrPhone.trim()) {
      setError("Please enter your email or phone number.");
      return;
    }

    const inputType = validateEmailOrPhone(emailOrPhone);
    if (inputType === "invalid") {
      setError("Please enter a valid email or 10-digit phone number.");
      return;
    }

    // Simulate sending a verification code (replace with actual API call)
    console.log("Sending verification code to:", emailOrPhone);
    setTimeout(() => {
      setStep(2); // Move to the next step
    }, 1000); // Simulate a 1-second delay
  };

  // Handle verification code submission
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");

    // Validate code
    if (!verificationCode.trim()) {
      setError("Please enter the verification code.");
      return;
    }

    // Simulate code verification (replace with actual API call)
    console.log("Verifying code:", verificationCode);
    setTimeout(() => {
      setStep(3); // Move to the next step
    }, 1000); // Simulate a 1-second delay
  };

  // Handle password reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    // Validate new password and confirm password
    if (!newPassword.trim()) {
      setError("Please enter a new password.");
      return;
    }
    if (!confirmPassword.trim()) {
      setError("Please confirm your new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    // Simulate password reset (replace with actual API call)
    console.log("Resetting password for:", emailOrPhone);
    setTimeout(() => {
      alert("Password reset successfully!");
      router.push("/login"); // Redirect to login page
    }, 1000); // Simulate a 1-second delay
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
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

      {/* Forgot Password Form */}
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-2xl z-20 w-full max-w-md border border-white/20">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 font-poppins">
          Forgot Password
        </h2>

        {/* Step 1: Enter email/phone */}
        {step === 1 && (
          <form onSubmit={handleSendCode}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Email or Phone Number
              </label>
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="Enter your email or phone number"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all shadow-md"
            >
              Send Verification Code
            </button>
          </form>
        )}

        {/* Step 2: Enter verification code */}
        {step === 2 && (
          <form onSubmit={handleVerifyCode}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="Enter the verification code"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all shadow-md"
            >
              Verify Code
            </button>
          </form>
        )}

        {/* Step 3: Reset password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="Enter your new password"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="Confirm your new password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all shadow-md"
            >
              Reset Password
            </button>
          </form>
        )}

        {/* Error message */}
        {error && (
          <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
        )}

        {/* Back to login link */}
        <div className="mt-4 text-center">
          <button
            onClick={() => router.push("/login")}
            className="text-red-500 hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}