"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

export default function AboutUs() {
  const router = useRouter();
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true); // Initially muted for autoplay

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-pink-50 to-red-50 font-sans">
      {/* Header with Navigation Links */}
      <div className="w-full flex justify-between items-center p-6 max-w-6xl mx-auto text-black backdrop-blur-md bg-white/30 rounded-lg shadow-sm mt-4">
        <h1 className="text-5xl font-bold font-barlow">RaqtKosh</h1>
        <nav className="flex gap-6">
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
        {/* Hero Section with Video */}
        <div className="relative w-full h-[60vh] mb-12 rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted={isMuted}
            loop
            controls // Enable native video controls
            className="w-full h-full object-cover"
          >
            <source src="/videos/aboutusnew.mp4" type="video/mp4" /> {/* Replace with your video */}
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black bg-opacity-20 z-10"></div>
          {/* Custom Mute Button */}
          <button
            onClick={toggleMute}
            className="absolute bottom-4 right-4 z-20 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-colors duration-300"
          >
            {isMuted ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Rest of the content remains the same */}
        {/* Mission Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg mb-12">
          <h2 className="text-4xl font-bold mb-6 text-red-600">What We Do</h2>
          <p className="text-lg text-gray-700 mb-6">
            At RaqtKosh, we organize blood donation camps and ensure that blood is delivered to your respective center within <span className="font-bold text-red-600">30 minutes</span>. We are a trusted partner, and the blood you receive undergoes <span className="font-bold text-red-600">100+ tests</span> to ensure safety and quality.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative h-64">
              <Image
                src="/images/mission-1.webp" // Replace with your image
                alt="Mission Image 1"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <div className="relative h-64">
              <Image
                src="/images/mission-2.webp" // Replace with your image
                alt="Mission Image 2"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Why Donate Blood Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg mb-12">
          <h2 className="text-4xl font-bold mb-6 text-red-600">Why Donate Blood?</h2>
          <p className="text-lg text-gray-700 mb-6">
            Blood donation is a simple, safe, and life-saving act. Here are some reasons why you should consider donating blood:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-red-50 p-6 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-4 text-red-600">Save Lives</h3>
              <p className="text-lg text-gray-700">
                Your donation can save up to 3 lives.
              </p>
            </div>
            <div className="bg-red-50 p-6 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-4 text-red-600">Health Benefits</h3>
              <p className="text-lg text-gray-700">
                Donating blood can reduce the risk of heart disease and improve overall health.
              </p>
            </div>
            <div className="bg-red-50 p-6 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-4 text-red-600">Community Impact</h3>
              <p className="text-lg text-gray-700">
                Your donation helps build a stronger and healthier community.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-4xl font-bold mb-6 text-red-600">Our Commitment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-red-50 p-6 rounded-lg">
              <p className="text-lg italic text-gray-700">
                "We are committed to saving lives and making a difference in the world. Every drop of blood counts."
              </p>
              <p className="text-right font-bold text-red-600 mt-4">- RaqtKosh Team</p>
            </div>
            <div className="bg-red-50 p-6 rounded-lg">
              <p className="text-lg italic text-gray-700">
                "Our mission is to bring change by ensuring no one suffers due to a lack of blood."
              </p>
              <p className="text-right font-bold text-red-600 mt-4">- RaqtKosh Team</p>
            </div>
            <div className="bg-red-50 p-6 rounded-lg">
              <p className="text-lg italic text-gray-700">
                "We believe in creating a healthier and safer community through blood donation."
              </p>
              <p className="text-right font-bold text-red-600 mt-4">- RaqtKosh Team</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}