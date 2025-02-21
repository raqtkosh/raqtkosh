"use client";

import { SignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  // Redirect to dashboard if user is already signed in
  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-red-50 font-sans">
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        redirectUrl="/dashboard"
        appearance={{
          elements: {
            formButtonPrimary: "bg-red-500 hover:bg-red-600 text-white",
            formFieldInput: "border border-gray-300 rounded-md p-2",
            formFieldLabel: "text-gray-700",
          },
          variables: {
            colorPrimary: "red",
          },
        }}
      />
    </div>
  );
}