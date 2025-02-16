"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

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

      {/* Hero Section */}
      <div className="relative w-full h-[60vh] mt-8">
        {/* Full-Page Image */}
        <Image
          src="/images/first.webp" // Replace with your image
          alt="Blood Donation"
          layout="fill"
          objectFit="cover"
          className="z-0 rounded-lg"
        />

        {/* Semi-Transparent Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20 z-10 rounded-lg"></div>

        {/* Hero Content */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-20">
          <h2 className="text-5xl font-bold mb-6 text-white drop-shadow-lg">
            Donate Blood, Save Lives
          </h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto text-white drop-shadow-lg">
            RaqtKosh is dedicated to facilitating easy and efficient blood donations. Sign up to donate blood and help those in need. Quick, secure, and life-saving!
          </p>
          <div className="flex justify-center gap-4">
            <Button
              className="bg-white text-red-500 font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-red-100 hover:scale-105 transition-transform duration-300"
              onClick={() => router.push("/signup")}
            >
              Join Us
            </Button>
            <Button
              className="bg-white text-red-500 font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-red-100 hover:scale-105 transition-transform duration-300"
              onClick={() => router.push("/donate")}
            >
              Donate Blood
            </Button>
          </div>
        </div>
      </div>

      {/* Key Features, Testimonials, and Statistics Sections */}
      <div className="w-full py-20">
        <div className="w-full max-w-6xl px-4 mx-auto">
          {/* Key Features Section */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
              Why Choose RaqtKosh?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <h3 className="text-2xl font-bold mb-4 text-red-600">Quick & Easy</h3>
                <p className="text-lg text-gray-600">
                  Register and donate blood in just a few simple steps.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <h3 className="text-2xl font-bold mb-4 text-red-600">Save Lives</h3>
                <p className="text-lg text-gray-600">
                  Your donation can save up to 3 lives.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <h3 className="text-2xl font-bold mb-4 text-red-600">24/7 Support</h3>
                <p className="text-lg text-gray-600">
                  We are here to help you anytime, anywhere.
                </p>
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
              What Our Donors Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <p className="text-lg italic text-gray-600">
                  "Donating blood through RaqtKosh was a seamless experience. Highly recommend!"
                </p>
                <p className="text-right font-bold text-red-600 mt-4">- Ranjan Trivedi</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <p className="text-lg italic text-gray-600">
                  "RaqtKosh made it so easy to find a donation center near me. Great initiative!"
                </p>
                <p className="text-right font-bold text-red-600 mt-4">- Shweta Vishnawat</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <p className="text-lg italic text-gray-600">
                  "I feel proud to be a part of this life-saving mission. Thank you, RaqtKosh!"
                </p>
                <p className="text-right font-bold text-red-600 mt-4">- Gurjeet Saine</p>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div>
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
              Our Impact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <p className="text-5xl font-bold text-red-600">500+</p>
                <p className="text-lg text-gray-600">Lives Saved</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <p className="text-5xl font-bold text-red-600">1K+</p>
                <p className="text-lg text-gray-600">Donations</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <p className="text-5xl font-bold text-red-600">100+</p>
                <p className="text-lg text-gray-600">Partners</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}