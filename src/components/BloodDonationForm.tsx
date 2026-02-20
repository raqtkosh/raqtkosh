/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { toast } from "react-toastify";
import { Loader2, HeartPulse, CheckCircle, Gift, Droplet, Award } from 'lucide-react';
import { BloodType } from '@prisma/client';
import { useRouter } from 'next/navigation';

interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

export function BloodDonationForm() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [pincode, setPincode] = useState('');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState('');
  const [bloodType, setBloodType] = useState<BloodType>();
  const [quantity, setQuantity] = useState(1);
  const [donorName, setDonorName] = useState('');
  const [isLoadingHospitals, setIsLoadingHospitals] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasSearched, setHasSearched] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!pincode || pincode.length < 3) newErrors.pincode = 'Please enter a valid pincode';
    if (!selectedHospital) newErrors.hospital = 'Please select a hospital';
    if (!bloodType) newErrors.bloodType = 'Please select your blood type';
    if (!donorName) newErrors.donorName = 'Please enter your full name';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormComplete = () =>
    pincode.length >= 3 && selectedHospital && bloodType && donorName;

  const fetchHospitals = async () => {
    if (pincode.length < 3) {
      setErrors(prev => ({ ...prev, pincode: 'Pincode must be at least 3 digits' }));
      return;
    }
    setIsLoadingHospitals(true);
    setHasSearched(true);
    try {
      const response = await fetch(`/api/hospitals?pincode=${pincode}`);
      if (!response.ok) throw new Error('Failed to fetch hospitals');
      const data = await response.json();
      setHospitals(data);
      setErrors(prev => ({ ...prev, pincode: '' }));
    } catch {
      toast.error('Failed to load hospitals. Please try again.');
      setHospitals([]);
      setErrors(prev => ({ ...prev, pincode: 'Failed to fetch hospitals for this pincode' }));
    } finally {
      setIsLoadingHospitals(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) { toast.error('Please sign in to donate blood'); return; }
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const hospital = hospitals.find(h => h.id === selectedHospital);
      if (!hospital) throw new Error('Hospital not found');
      const response = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hospitalId: selectedHospital, bloodType, quantity, donorName }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit donation');
      }
      await response.json();
      toast.success('Blood donation request submitted successfully!');
      setIsSuccess(true);
      setPincode(''); setSelectedHospital(''); setBloodType(undefined);
      setQuantity(1); setDonorName(''); setHospitals([]); setErrors({}); setHasSearched(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit donation');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => router.push('/dashboard/user'), 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, router]);

  if (isSuccess) {
    return (
      <div className="flex-1 bg-gray-50 h-full p-4 lg:p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your blood donation request has been received.
            <br />
            <span className="text-sm text-gray-500">Redirecting to dashboard in 5 seconds...</span>
          </p>
          <Button onClick={() => router.push('/dashboard/user')} className="bg-red-600 hover:bg-red-700 text-white w-full">
            Go to Dashboard Now
          </Button>
        </div>
      </div>
    );
  }

  // ── matches UserDashboard: flex-1 bg-gray-50 h-full p-4 lg:p-6, inner space-y-8 ──
  return (
    <div className="flex-1 bg-gray-50 h-full p-4 lg:p-6">
      <div className="mx-auto w-full max-w-[1920px] space-y-8">

        {/* ── Row 1: Header — matches Dashboard header exactly ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Donate Blood</h1>
            <p className="text-gray-600 mt-1">Your single donation can save up to three lives. Join our community of heroes.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-50 rounded-lg border border-red-100">
              <Droplet className="h-4 w-4 text-red-500 flex-shrink-0" />
              <span className="text-sm font-medium text-red-700">Safe &amp; Sterile</span>
            </div>
            <div className="p-2.5 rounded-full bg-white border border-gray-200 text-red-600">
              <HeartPulse className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* ── Row 2: How it Works — 4-col horizontal ── */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-6">How it Works</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { n: 1, title: 'Registration', desc: 'Complete a quick details form' },
              { n: 2, title: 'Health Check', desc: 'Brief basic health screening' },
              { n: 3, title: 'Donation', desc: '10–15 min safe collection' },
              { n: 4, title: 'Refreshment', desc: 'Rest, snacks & reward points' },
            ].map(step => (
              <div key={step.n} className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="w-9 h-9 mb-3 flex items-center justify-center rounded-full bg-red-50 text-red-600 font-bold text-sm border border-red-100">
                  {step.n}
                </span>
                <p className="text-sm font-semibold text-gray-900">{step.title}</p>
                <p className="text-sm text-gray-500 mt-1">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Row 3: Schedule Donation Form ── */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-5 bg-red-600 rounded-full inline-block"></span>
            Schedule Donation
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Pincode */}
            <div>
              <Label htmlFor="pincode" className="text-sm font-medium text-gray-700">
                Search Hospitals by Pincode *
              </Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="pincode"
                  value={pincode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 6) { setPincode(val); setErrors(prev => ({ ...prev, pincode: '' })); }
                  }}
                  placeholder="Enter 6-digit pincode"
                  maxLength={6}
                  className="bg-gray-50 h-10 text-sm border-gray-200 flex-1"
                />
                <Button
                  type="button"
                  onClick={fetchHospitals}
                  disabled={pincode.length < 6 || isLoadingHospitals}
                  className="px-5 h-10 bg-gray-900 text-white hover:bg-gray-800 text-sm flex-shrink-0"
                >
                  {isLoadingHospitals ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
                </Button>
              </div>
              {errors.pincode && <p className="text-xs text-red-500 mt-1.5">{errors.pincode}</p>}
            </div>

            {/* Hospital */}
            {hospitals.length > 0 && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <Label htmlFor="hospital" className="text-sm font-medium text-gray-700">Select Hospital *</Label>
                <Select
                  value={selectedHospital}
                  onValueChange={(v) => { setSelectedHospital(v); setErrors(prev => ({ ...prev, hospital: '' })); }}
                >
                  <SelectTrigger id="hospital" className="bg-gray-50 h-10 text-sm border-gray-200 mt-2">
                    <SelectValue placeholder="Choose a nearby hospital" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    {hospitals.map(h => (
                      <SelectItem key={h.id} value={h.id} className="text-sm py-2">
                        <div className="flex flex-col">
                          <span className="font-medium">{h.name}</span>
                          <span className="text-xs text-gray-500">{h.address}, {h.city}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.hospital && <p className="text-xs text-red-500 mt-1.5">{errors.hospital}</p>}
              </div>
            )}

            {hasSearched && hospitals.length === 0 && !isLoadingHospitals && (
              <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
                <p className="text-sm font-medium text-orange-800">No hospitals found nearby.</p>
                <p className="text-sm text-gray-500 mt-1">Try searching a different pincode.</p>
              </div>
            )}

            {/* Blood Type & Units */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="bloodType" className="text-sm font-medium text-gray-700">Blood Type *</Label>
                <Select
                  value={bloodType}
                  onValueChange={(v: BloodType) => { setBloodType(v); setErrors(prev => ({ ...prev, bloodType: '' })); }}
                >
                  <SelectTrigger id="bloodType" className="bg-gray-50 h-10 text-sm border-gray-200 mt-2">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    {Object.values(BloodType).map(t => (
                      <SelectItem key={t} value={t} className="text-sm">{t.replace('_', ' ')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.bloodType && <p className="text-xs text-red-500 mt-1.5">{errors.bloodType}</p>}
              </div>
              <div>
                <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">Units *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={e => setQuantity(Math.min(10, Math.max(1, Number(e.target.value))))}
                  className="bg-gray-50 h-10 text-sm border-gray-200 mt-2"
                />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <Label htmlFor="donorName" className="text-sm font-medium text-gray-700">Full Name *</Label>
              <Input
                id="donorName"
                value={donorName}
                onChange={e => { setDonorName(e.target.value); setErrors(prev => ({ ...prev, donorName: '' })); }}
                placeholder="Enter name as per government ID"
                className="bg-gray-50 h-10 text-sm border-gray-200 mt-2"
              />
              {errors.donorName && <p className="text-xs text-red-500 mt-1.5">{errors.donorName}</p>}
            </div>

            {/* Submit */}
            <div>
              <Button
                type="submit"
                className={`w-full h-11 text-sm font-semibold transition-all ${isFormComplete() && isSignedIn
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gray-100 cursor-not-allowed text-gray-400'
                  }`}
                disabled={!isFormComplete() || isSubmitting || !isSignedIn}
              >
                {isSubmitting
                  ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</>
                  : 'Confirm Donation Request'
                }
              </Button>
              {!isSignedIn && (
                <p className="text-sm text-red-600 text-center mt-2">Please sign in to submit a donation request.</p>
              )}
            </div>

          </form>
        </div>


        {/* ── Row 5: Earn Rewards — full width, last ── */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl shadow-sm text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h2 className="font-semibold text-white">Earn Rewards</h2>
              <p className="text-gray-400 mt-1">Every donation earns you points, badges &amp; health insights.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/10 rounded-xl px-6 py-4 flex items-center gap-3 border border-white/10">
                <Award className="h-6 w-6 text-yellow-400 flex-shrink-0" />
                <div>
                  <p className="text-2xl font-bold leading-none">500</p>
                  <p className="text-sm text-gray-400 mt-1">Points / Donation</p>
                </div>
              </div>
              <div className="bg-white/10 rounded-xl px-6 py-4 flex items-center gap-3 border border-white/10">
                <Gift className="h-6 w-6 text-red-400 flex-shrink-0" />
                <div>
                  <p className="text-2xl font-bold leading-none">3x</p>
                  <p className="text-sm text-gray-400 mt-1">Lives Saved</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
