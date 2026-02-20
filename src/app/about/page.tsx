"use client";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";

export default function AboutUs() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true); 

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-pink-50 to-red-50 font-sans">
     
      <header className="w-full flex justify-between items-center px-6 py-4 max-w-6xl mx-auto text-black backdrop-blur-md bg-white/30 rounded-lg shadow-sm mt-4">
        <h1 className="text-4xl md:text-5xl font-bold font-barlow">
          <Link href="/">RaqtKosh</Link>
        </h1>
        <nav className="flex gap-5 md:gap-6">
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

      
      <div className="w-full max-w-6xl px-6 py-16">
       
        <div className="relative w-full h-[58vh] md:h-[60vh] mb-12 rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted={isMuted}
            loop
            controls 
            className="w-full h-full object-cover"
          >
            <source src="/videos/aboutusnew.mp4" type="video/mp4" /> 
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black bg-opacity-20 z-10"></div>
         
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

       
        <div className="bg-white p-8 rounded-xl shadow-lg mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-red-600">What We Do</h2>
          <p className="text-lg text-gray-700 mb-6">
            At RaqtKosh, we organize blood donation camps and ensure that blood is delivered to your respective center within <span className="font-bold text-red-600">30 minutes</span>. We are a trusted partner, and the blood you receive undergoes <span className="font-bold text-red-600">100+ tests</span> to ensure safety and quality.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative h-64">
              <Image
                src="/images/mission-1.jpg" 
                alt="Mission Image 1"
                fill
                className="rounded-lg object-cover"
              />
            </div>
            <div className="relative h-64">
              <Image
                src="/images/mission-2.jpg" 
                alt="Mission Image 2"
                fill
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>

     
        <div className="bg-white p-8 rounded-xl shadow-lg mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-red-600">Why Donate Blood?</h2>
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

  
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-red-600">Our Commitment</h2>
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
