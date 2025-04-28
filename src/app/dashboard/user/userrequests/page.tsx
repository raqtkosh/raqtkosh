'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface Request {
  id: string;
  bloodType: string;
  quantity: number;
  urgency: string;
  status: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  hospital?: string;
  patientName?: string;
  reason?: string;
  assignedTo?: string;
  fulfilledAt?: string;
  createdAt: string;
}

export default function UserRequests() {
  const { isLoaded, user } = useUser();
  const router = useRouter();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoaded) return;

    const fetchRequests = async () => {
      try {
        const res = await fetch('/api/users/requests');
        if (!res.ok) {
          throw new Error('Failed to fetch requests');
        }
        const data = await res.json();
        setRequests(data.requests);
      } catch (err) {
        console.error('Error fetching requests:', err);
        setError('Failed to load your requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [isLoaded]);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-black">Loading your requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 rounded-2xl shadow-md w-full max-w-4xl mx-auto mt-10 text-black">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Requests</h2>

      {requests.length === 0 ? (
        <p className="text-center">You have not created any requests yet.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="p-4 bg-white rounded-lg shadow-sm border text-black"
            >
              <h3 className="text-lg font-semibold mb-2">Request Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <p><strong>Blood Type:</strong> {request.bloodType.replace('_', ' ')}</p>
                <p><strong>Quantity:</strong> {request.quantity} units</p>
                <p><strong>Urgency:</strong> {request.urgency}</p>
                <p><strong>Status:</strong> <span className="capitalize">{request.status.toLowerCase()}</span></p>
                <p className="md:col-span-2">
                  <strong>Address:</strong> {request.address.street}, {request.address.city}, {request.address.state} - {request.address.postalCode}, {request.address.country}
                </p>
                {request.hospital && <p><strong>Hospital:</strong> {request.hospital}</p>}
                {request.patientName && <p><strong>Patient Name:</strong> {request.patientName}</p>}
                {request.reason && <p><strong>Reason:</strong> {request.reason}</p>}
                {request.fulfilledAt && (
                  <p className="md:col-span-2">
                    <strong>Fulfilled At:</strong> {new Date(request.fulfilledAt).toLocaleString()}
                  </p>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Created: {new Date(request.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
