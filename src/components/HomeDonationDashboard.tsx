"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function HomeDonationDashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [primaryAddress, setPrimaryAddress] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch user's primary address when component mounts
  useEffect(() => {
    const fetchPrimaryAddress = async () => {
      try {
        const res = await fetch("/api/user/addresses");
        const data = await res.json();

        if (res.ok && data.addresses?.length > 0) {
          const primary = data.addresses.find((addr: any) => addr.isPrimary);
          setPrimaryAddress(primary || null);
        } else {
          setPrimaryAddress(null);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setPrimaryAddress(null);
      } finally {
        setAddressLoading(false);
      }
    };

    if (user) {
      fetchPrimaryAddress();
    }
  }, [user]);

  const raiseRequest = async () => {
    if (!primaryAddress) {
      alert("Primary address not found. Cannot raise request.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/home-donation/raise-request", {
        method: "POST",
      });

      if (res.ok) {
        // Show success message
        setSuccessMessage("Home donation request raised successfully!");
        router.refresh();
        
        // Hide success message after 5 seconds and redirect to dashboard
        setTimeout(() => {
          setSuccessMessage(null);
          router.push("/dashboard"); // Redirect to the dashboard
        }, 5000);
      } else {
        const error = await res.text();
        setSuccessMessage(`Error: ${error}`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      }
    } catch (error) {
      console.error(error);
      setSuccessMessage("Something went wrong.");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  if (addressLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-black">
        <p>Loading your address...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md w-full max-w-md mx-auto mt-10 text-black">
      <h2 className="text-2xl font-bold mb-4 text-center">Home Donation</h2>

      {primaryAddress ? (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Your Primary Address</h3>
          <p>{primaryAddress.street},</p>
          <p>
            {primaryAddress.city}, {primaryAddress.state} - {primaryAddress.postalCode}
          </p>
          <p>{primaryAddress.country}</p>
        </div>
      ) : (
        <p className="text-center">No primary address found. Please update your profile.</p>
      )}

      <button
        onClick={raiseRequest}
        disabled={loading || !primaryAddress}
        className="w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition disabled:opacity-50"
      >
        {loading ? "Raising Request..." : "Raise Home Donation Request"}
      </button>

      {/* Success message */}
      {successMessage && (
        <div className="mt-4 text-center text-green-600">
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  );
}
