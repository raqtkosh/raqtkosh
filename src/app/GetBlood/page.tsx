"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LookingForBlood() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1); 
  const [city, setCity] = useState<string | null>(null);
  const [bloodType, setBloodType] = useState<string | null>(null);
  const [isBloodAvailable, setIsBloodAvailable] = useState<boolean | null>(null);

  const cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata"];
  const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity);
    setStep(2); 
  };

  const handleBloodTypeSelect = (selectedBloodType: string) => {
    setBloodType(selectedBloodType);
   
   // setIsBloodAvailable(Math.random() > 0.5); 
    setIsBloodAvailable(true); 
    setStep(3); 
  };

  const handleSignupLogin = () => {
    router.push("/sign-up"); 
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-pink-50 to-red-50 font-sans">
      {/* Header with Navigation Links */}
      <header className="w-full flex justify-between items-center px-6 py-4 max-w-6xl mx-auto text-black backdrop-blur-md bg-white/30 rounded-lg shadow-sm mt-4">
        <h1 className="text-4xl md:text-5xl font-bold font-barlow">
          <Link href="/">RaqtKosh</Link>
        </h1>
        <nav className="flex gap-5 md:gap-6">
          <Link
            href="/about"
            className="text-lg hover:underline hover:text-red-600 transition-colors duration-300"
          >
            About Us
          </Link>
          <Link
            href="/GetBlood"
            className="text-lg hover:underline hover:text-red-600 transition-colors duration-300"
          >
            Looking for Blood
          </Link>
          <Link
            href="/DonateBlood"
            className="text-lg hover:underline hover:text-red-600 transition-colors duration-300"
          >
            Want to Donate Blood
          </Link>
          <Link
            href="/sign-in"
            className="text-lg hover:underline hover:text-red-600 transition-colors duration-300"
          >
            Blood Bank Login
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <div className="w-full max-w-6xl px-6 py-16">
        {/* Step 1: Select City */}
        {step === 1 && (
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-red-600">Select Your City</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cities.map((city) => (
                <Button
                  key={city}
                  className="bg-red-600 text-white font-semibold h-12 rounded-lg shadow-lg hover:bg-red-700 hover:scale-105 transition-transform duration-300"
                  onClick={() => handleCitySelect(city)}
                >
                  {city}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Blood Type */}
        {step === 2 && (
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-red-600">Select Blood Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {bloodTypes.map((type) => (
                <Button
                  key={type}
                  className="bg-red-600 text-white font-semibold h-12 rounded-lg shadow-lg hover:bg-red-700 hover:scale-105 transition-transform duration-300"
                  onClick={() => handleBloodTypeSelect(type)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Blood Availability */}
        {step === 3 && (
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-red-600">
              {isBloodAvailable ? "Blood is Available!" : "Blood is Not Available"}
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              {isBloodAvailable
                ? `We have ${bloodType} blood available in ${city}. Please sign up or log in to proceed.`
                : `Unfortunately, ${bloodType} blood is not available in ${city} at the moment. Please check back later.`}
            </p>
            {isBloodAvailable && (
              <div className="flex justify-center gap-4">
                <Button
                  className="bg-red-600 text-white font-semibold h-12 px-8 rounded-lg shadow-lg hover:bg-red-700 hover:scale-105 transition-transform duration-300"
                  onClick={handleSignupLogin}
                >
                  Sign Up
                </Button>
                <Button
                  className="bg-red-600 text-white font-semibold h-12 px-8 rounded-lg shadow-lg hover:bg-red-700 hover:scale-105 transition-transform duration-300"
                  onClick={handleSignupLogin}
                >
                  Login
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
