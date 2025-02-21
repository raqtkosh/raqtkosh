"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DonateBlood() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [camps, setCamps] = useState<{ name: string; address: string }[]>([]);

  const cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata"];
  const dummyCamps = [
    { name: "Camp A", address: "123 Main St, Mumbai" },
    { name: "Camp B", address: "456 Elm St, Delhi" },
    { name: "Camp C", address: "789 Oak St, Bangalore" },
  ];

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setCamps(dummyCamps); // Replace with actual API call to fetch camps
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-pink-50 to-red-50 font-sans">
      {/* Header with Navigation Links */}
      <div className="w-full flex justify-between items-center p-6 max-w-6xl mx-auto text-black backdrop-blur-md bg-white/30 rounded-lg shadow-sm mt-4">
        <h1 className="text-5xl font-bold font-barlow">RaqtKosh</h1>
        <nav className="flex gap-6">
          <button
            onClick={() => router.push("/about")}
            className="text-lg hover:underline hover:text-red-600 transition-colors duration-300"
          >
            About Us
          </button>
          <button
            onClick={() => router.push("/find-blood")}
            className="text-lg hover:underline hover:text-red-600 transition-colors duration-300"
          >
            Looking for Blood
          </button>
          <button
            onClick={() => router.push("/donate")}
            className="text-lg hover:underline hover:text-red-600 transition-colors duration-300"
          >
            Want to Donate Blood
          </button>
          <button
            onClick={() => router.push("/login")}
            className="text-lg hover:underline hover:text-red-600 transition-colors duration-300"
          >
            Blood Bank Login
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-6xl px-4 py-12">
        {/* Signup/Login Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg mb-12 text-center">
          <h2 className="text-4xl font-bold mb-6 text-red-600">
            Sign Up or Login to Get More Rewards!
          </h2>
          <div className="flex justify-center gap-4">
            <Button
              className="bg-red-600 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-red-700 hover:scale-105 transition-transform duration-300"
              onClick={() => router.push("/sign-up")}
            >
              Sign Up
            </Button>
            <Button
              className="bg-red-600 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-red-700 hover:scale-105 transition-transform duration-300"
              onClick={() => router.push("/sign-in")}
            >
              Login
            </Button>
          </div>
        </div>

        {/* Donate at Home Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Side: Donate at Home Form */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-red-600">Donate at Home</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">Email ID</label>
                <input
                  type="email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">Home Address</label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="Enter your home address"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-red-600 text-white font-semibold py-4 rounded-lg shadow-lg hover:bg-red-700 hover:scale-105 transition-transform duration-300"
              >
                Submit
              </Button>
            </form>
          </div>

          {/* Right Side: Nearest Camp Section */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-red-600">Donate at Nearest Camp</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-700">Select City</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  onChange={(e) => handleCityChange(e.target.value)}
                >
                  <option value="">Choose a city</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCity && (
                <div>
                  <label className="block text-lg font-medium text-gray-700">Available Camps</label>
                  <div className="space-y-4">
                    {camps.map((camp, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-red-600"
                        />
                        <div>
                          <p className="text-lg font-semibold">{camp.name}</p>
                          <p className="text-gray-600">{camp.address}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg mt-12">
          <h2 className="text-3xl font-bold mb-6 text-red-600">Additional Information</h2>
          <p className="text-lg text-gray-700">
            For more details about blood donation camps, eligibility criteria, and FAQs, please visit our{" "}
            <a href="/faq" className="text-red-600 hover:underline">
              FAQ section
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}