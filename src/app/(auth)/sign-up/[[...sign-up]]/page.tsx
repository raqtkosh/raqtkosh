"use client";

import { SignUp, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Signup() {
  const router = useRouter();
  const { isSignedIn } = useUser();

 
  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative">
   
      <Image
        src="/images/loginpageimage.webp"
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="z-0"
      />

      
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

   
      <button
        onClick={() => router.push("/")}
        className="absolute left-4 top-4 text-white hover:text-gray-300 flex items-center z-20"
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

    
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        redirectUrl="/dashboard"
        appearance={{
          elements: {
            formButtonPrimary: "bg-red-500 hover:bg-red-600",
            footerActionLink: "text-red-500 hover:text-red-600",
            socialButtonsBlockButton: "border border-gray-300 hover:bg-gray-50",
            socialButtonsBlockButtonText: "text-gray-700",
            card: "bg-white shadow-2xl rounded-xl border border-gray-200",
          },
        }}
      />
    </div>
  );
}
