/* eslint-disable react/no-unescaped-entities */
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

type FeedbackItem = {
  id: string;
  name: string;
  profileImageUrl: string | null;
  feedback: string;
};

export default function Home() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [currentFeedbackIndex, setCurrentFeedbackIndex] = useState(0);

  // Redirect to dashboard if user is already signed in
  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch("/api/feedbacks");
        if (!response.ok) return;
        const data = await response.json();
        setFeedbacks(data.feedbacks || []);
      } catch (error) {
        console.error("Failed to fetch feedbacks:", error);
      }
    };
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    if (feedbacks.length <= 3) return;

    const intervalId = setInterval(() => {
      setCurrentFeedbackIndex((prev) => (prev + 1) % feedbacks.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [feedbacks.length]);

  const visibleFeedbacks =
    feedbacks.length <= 3
      ? feedbacks
      : Array.from({ length: 3 }, (_, offset) => feedbacks[(currentFeedbackIndex + offset) % feedbacks.length]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-pink-50 to-red-50 font-sans">
      {/* Header with Navigation Links */}
      <header className="w-full flex justify-between items-center px-6 py-4 max-w-6xl mx-auto text-black backdrop-blur-md bg-white/30 rounded-lg shadow-sm mt-4">
        <h1 className="text-4xl md:text-5xl font-bold font-barlow">
          <Link href="/">RaqtKosh</Link>
        </h1>
        <nav className="flex gap-5 md:gap-6 items-center">
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

          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <Link
              href="/sign-in"
              className="text-lg hover:underline hover:text-red-600 transition-colors duration-300"
            >
              Blood Bank Login
            </Link>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative w-full h-[58vh] md:h-[60vh] mt-8">
        <Image
          src="/images/first.webp"
          alt="Blood Donation"
          fill
          priority
          sizes="100vw"
          className="z-0 rounded-lg object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 z-10 rounded-lg"></div>
        <div className="absolute top-1/2 left-1/2 w-full max-w-4xl px-6 transform -translate-x-1/2 -translate-y-1/2 text-center z-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-5 text-white drop-shadow-lg leading-tight">
            Donate Blood, Save Lives
          </h2>
          <p className="text-base md:text-lg mb-7 max-w-2xl mx-auto text-white drop-shadow-lg">
            RaqtKosh is dedicated to facilitating easy and efficient blood donations. Sign up to donate blood and help those in need. Quick, secure, and life-saving!
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button
              className="bg-white text-red-500 font-semibold h-12 px-8 rounded-lg shadow-lg hover:bg-red-100 hover:scale-105 transition-transform duration-300"
              onClick={() => router.push("/sign-up")}
              aria-label="Join RaqtKosh by creating an account"
            >
              Join Us
            </Button>
            <Button
              className="bg-white text-red-500 font-semibold h-12 px-8 rounded-lg shadow-lg hover:bg-red-100 hover:scale-105 transition-transform duration-300"
              onClick={() => router.push("/DonateBlood")}
              aria-label="Go to blood donation page"
            >
              Donate Blood
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full py-16 md:py-20">
        <div className="w-full max-w-6xl px-6 mx-auto">
     
          <div className="mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-12 text-gray-800">
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

         
          <div className="mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-12 text-gray-800">
              What Our Donors Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {feedbacks.length > 0 ? (
                visibleFeedbacks.map((item) => {
                  return (
                    <div key={item.id} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <p className="text-lg italic text-gray-600 mb-4 text-center">"{item.feedback}"</p>
                      <p className="font-bold text-red-600 text-center">{item.name}</p>
                    </div>
                  );
                })
              ) : (
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 md:col-span-2 lg:col-span-3 text-center">
                  <p className="text-lg italic text-gray-600">
                    Be the first donor to share feedback from your profile.
                  </p>
                </div>
              )}
            </div>
          </div>

          
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-12 text-gray-800">
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
