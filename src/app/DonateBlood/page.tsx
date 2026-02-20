"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "@/components/ui/toaster";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function DonateBlood() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [camps, setCamps] = useState<{ name: string; address: string }[]>([]);
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  const cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata"];
  const dummyCamps = [
    { name: "Camp A", address: "123 Main St, Mumbai" },
    { name: "Camp B", address: "456 Elm St, Delhi" },
    { name: "Camp C", address: "789 Oak St, Bangalore" },
  ];

  const faqItems = [
    {
      question: "Who can donate blood?",
      answer: "Most people can donate blood if they are in good health, weigh at least 50kg, and are between 18-65 years old."
    },
    {
      question: "How often can I donate blood?",
      answer: "You can donate whole blood every 56 days (8 weeks). Platelet donations can be made more frequently."
    },
    {
      question: "Is blood donation safe?",
      answer: "Yes, blood donation is completely safe. New, sterile equipment is used for each donor."
    },
    {
      question: "How long does the process take?",
      answer: "The entire process takes about 45 minutes to an hour, with the actual donation taking only 8-10 minutes."
    },
    {
      question: "What should I do before donating?",
      answer: "Eat a healthy meal, drink plenty of fluids, and get a good night's sleep before your donation."
    }
  ];

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setCamps(dummyCamps); // Replace with actual API call later
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Blood donation request submitted successfully!");

    // Reset form after short delay
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.reset();
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-pink-50 to-red-50 font-sans">
      <Toaster />

      {/* Header */}
      <header className="w-full flex justify-between items-center px-6 py-4 max-w-6xl mx-auto text-black backdrop-blur-md bg-white/30 rounded-lg shadow-sm mt-4">
        <h1 className="text-4xl md:text-5xl font-bold font-barlow">
          <Link href="/">RaqtKosh</Link>
        </h1>
        <nav className="flex gap-5 md:gap-6">
          <Link href="/about" className="text-lg hover:underline hover:text-red-600 transition-colors duration-300">About Us</Link>
          <Link href="/GetBlood" className="text-lg hover:underline hover:text-red-600 transition-colors duration-300">Looking for Blood</Link>
          <Link href="/DonateBlood" className="text-lg hover:underline hover:text-red-600 transition-colors duration-300">Want to Donate Blood</Link>
          <Link href="/sign-in" className="text-lg hover:underline hover:text-red-600 transition-colors duration-300">Blood Bank Login</Link>
        </nav>
      </header>

      {/* Main Content */}
      <div className="w-full max-w-6xl px-6 py-16">
        {/* Auth CTA */}
        <div className="bg-white p-8 rounded-xl shadow-lg mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-red-600">Sign Up or Login to Get More Rewards!</h2>
          <div className="flex justify-center gap-4">
            <Button onClick={() => router.push("/sign-up")} className="bg-red-600 text-white font-semibold h-12 px-8 rounded-lg shadow-lg hover:bg-red-700 hover:scale-105 transition-transform duration-300">
              Sign Up
            </Button>
            <Button onClick={() => router.push("/sign-in")} className="bg-red-600 text-white font-semibold h-12 px-8 rounded-lg shadow-lg hover:bg-red-700 hover:scale-105 transition-transform duration-300">
              Login
            </Button>
          </div>
        </div>

        {/* Form Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Donate at Home Form */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-red-600">Donate at Home</h2>
            <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter your name" className="bg-white text-black" />
              </div>
              <div>
                <Label htmlFor="email">Email ID</Label>
                <Input id="email" type="email" placeholder="Enter your email" className="bg-white text-black" />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="Enter your phone number" className="bg-white text-black" />
              </div>
              <div>
                <Label htmlFor="address">Home Address</Label>
                <textarea
                  id="address"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="Enter your home address"
                />
              </div>
              <Button type="submit" className="w-full bg-red-600 text-white font-semibold py-4 rounded-lg shadow-lg hover:bg-red-700 hover:scale-105 transition-transform duration-300">
                Submit
              </Button>
            </form>
          </div>

          {/* Donate at Center Section */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-red-600">Donate at a Center</h2>
            <div className="space-y-6">
              <div>
                <Label htmlFor="city">Select Your City</Label>
                <select
                  id="city"
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-red-600"
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
                <div className="space-y-4">
                  <Label>Select a Nearby Camp</Label>
                  <ul className="space-y-3">
                    {camps.map((camp, index) => (
                      <li key={index} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                        <p className="font-semibold text-red-600">{camp.name}</p>
                        <p className="text-gray-700">{camp.address}</p>
                      </li>
                    ))}
                  </ul>
                  <div>
                    <Label htmlFor="appointmentTime">Choose Appointment Time</Label>
                    <Input id="appointmentTime" type="datetime-local" className="bg-white text-black" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white p-8 rounded-xl shadow-lg mt-12">
          <h2 className="text-3xl font-bold mb-6 text-red-600">Additional Information</h2>
          <p className="text-lg text-gray-700">
            For more details about blood donation camps, eligibility criteria, and FAQs, please visit our{" "}
            <Dialog open={isFaqOpen} onOpenChange={setIsFaqOpen}>
              <DialogTrigger asChild>
                <button className="text-red-600 hover:underline cursor-pointer">FAQ section</button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-red-600 mb-4">Blood Donation FAQs</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {faqItems.map((item, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <h3 className="font-semibold text-lg text-gray-800">{item.question}</h3>
                      <p className="text-gray-600 mt-2 leading-relaxed">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </p>
        </div>
      </div>
    </div>
  );
}
