"use client";

import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  // Handle logout
  const handleLogout = () => {
    // Clear any user session or authentication state (if applicable)
    // For example, you might clear a token from localStorage or cookies
    localStorage.removeItem("authToken"); // Example: Remove auth token

    // Redirect to the first page (e.g., home page or login page)
    router.push("/"); // Redirect to the home page
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-red-500 to-pink-500 p-5 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, User</h1>
        <div className="text-right">
          <p>Blood Group: O+</p>
          <p>Donations: 2</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Donate Blood */}
        <div className="bg-white p-6 rounded-lg shadow-lg text-black">
          <h2 className="text-2xl font-bold mb-4">Donate Blood</h2>
          <div className="flex flex-col gap-4">
            <button className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors">
              Donate at Home
            </button>
            <button className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors">
              Donate at Nearby Center
            </button>
          </div>
        </div>

        {/* Get Blood */}
        <div className="bg-white p-6 rounded-lg shadow-lg text-black">
          <h2 className="text-2xl font-bold mb-4">Get Blood</h2>
          <div className="flex flex-col gap-4">
            <button className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors">
              Get Blood at Home
            </button>
            <button className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors">
              Get Blood at Hospital
            </button>
          </div>
        </div>
      </div>

      {/* Saved Addresses */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg text-black">
        <h2 className="text-2xl font-bold mb-4">Saved Addresses</h2>
        <ul className="list-disc list-inside">
          <li className="mb-2">123 Main St, City</li>
          <li className="mb-2">456 Elm St, Town</li>
        </ul>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="mb-2">Need help? Contact us at support@raqtkosh.com</p>
        <p>Learn more about blood donation <a href="#" className="text-red-300 hover:underline">here</a>.</p>
      </div>

      {/* Logout Button */}
      <div className="mt-8 text-center">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}