/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { Loader2, Gift, UserPlus, Copy, Check } from "lucide-react";

interface Referral {
  id: string;
  name: string;
  phoneNumber: string;
  createdAt: Date;
  status: 'PENDING' | 'COMPLETED';
}

export default function ReferralPage() {
  const { user } = useUser();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Error States
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    const fetchReferrals = async () => {
      if (!user?.id) return;

      setLoading(true);
      try {
        const response = await fetch('/api/referrals');
        if (!response.ok) throw new Error('Failed to fetch referrals');
        const data = await response.json();
        setReferrals(data);
      } catch (error) {
        toast.error('Failed to load referral history');
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    setNameError('');
    setPhoneError('');

    // Validate Name
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!name.trim()) {
      setNameError('Please enter a name');
      hasError = true;
    } else if (!nameRegex.test(name)) {
      setNameError('Name should only contain letters and spaces');
      hasError = true;
    }

    // Validate Phone
    const phoneRegex = /^[5-9][0-9]{9}$/;
    if (!phoneNumber.trim()) {
      setPhoneError('Please enter a mobile number');
      hasError = true;
    } else if (!phoneRegex.test(phoneNumber)) {
      setPhoneError('Enter a valid 10-digit mobile number starting with 5-9');
      hasError = true;
    }

    if (hasError) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phoneNumber })
      });

      if (!response.ok) throw new Error('Failed to submit referral');

      const newReferral = await response.json();
      setReferrals(prev => [newReferral, ...prev]);
      
      toast.success('Referral submitted successfully!');
      setName('');
      setPhoneNumber('');
    } catch (error) {
      toast.error('Failed to submit referral');
    } finally {
      setSubmitting(false);
    }
  };

  const completedReferrals = referrals.filter(r => r.status === 'COMPLETED').length;
  const pendingReferrals = referrals.filter(r => r.status === 'PENDING').length;

  const copyToClipboard = () => {
    const referralLink = `https://externally-close-ferret.ngrok-free.app/sign-up?ref=${user?.id}`;
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        setCopied(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast.error('Failed to copy link');
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-8">
        <UserPlus className="h-8 w-8 text-red-600" />
        <h1 className="text-2xl font-bold text-gray-900">Refer & Earn Points</h1>
      </div>

      {/* Referral Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">How it works</h2>
            <p className="text-gray-700 max-w-2xl">
              Refer friends and earn <strong>100 points</strong> for each successful referral.
              Your friend must sign up and complete their profile to qualify.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-blue-200 w-full md:w-auto min-w-[200px]">
            <p className="text-sm text-gray-500">Your referral points</p>
            <p className="text-3xl font-bold text-red-600">{completedReferrals * 100}</p>
            <p className="text-sm text-gray-500">
              ({completedReferrals} successful {completedReferrals === 1 ? 'referral' : 'referrals'})
            </p>
          </div>
        </div>
      </div>

      {/* Referral Form */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Refer a Friend</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-900">Friend's Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                className={`bg-white text-black ${nameError ? 'border-red-500' : 'border-gray-300'}`}
              />
              {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
            </div>

            {/* Phone Input */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-900">Mobile Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter 10-digit mobile number"
                className={`bg-white text-black ${phoneError ? 'border-red-500' : 'border-gray-300'}`}
              />
              {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white w-full md:w-auto"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Gift className="mr-2 h-4 w-4" />
                  Submit Referral
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Referral History */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Your Referrals</h2>
          <span className="text-sm text-gray-500">
            {pendingReferrals} pending • {completedReferrals} completed
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : referrals.length > 0 ? (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {referrals.map((referral) => (
                  <tr key={referral.id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{referral.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{referral.phoneNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(referral.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${referral.status === 'COMPLETED' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'}`}>
                        {referral.status === 'COMPLETED' ? 'Completed (+100 pts)' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-50 p-8 text-center rounded-lg border border-gray-200">
            <p className="text-gray-500">You haven't referred anyone yet.</p>
          </div>
        )}
      </div>

      {/* Share Referral Link */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Share your referral link</h3>
        <p className="text-sm text-gray-600 mb-4">
          Earn points when your friends sign up using your unique link
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={`https://externally-close-ferret.ngrok-free.app/sign-up`}
            readOnly
            className="bg-white text-black border-gray-300 flex-grow"
          />
          <Button
            onClick={copyToClipboard}
            className="bg-gray-800 hover:bg-gray-700 text-white whitespace-nowrap"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
