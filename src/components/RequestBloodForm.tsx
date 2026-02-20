/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useRef, useState } from 'react';
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
import {
  Loader2, HeartPulse, CheckCircle, Droplet,
  CreditCard, FileText, UploadCloud, X, FileImage
} from 'lucide-react';
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

// Uploads file to our server-side /api/upload route (credentials stay server-side)
async function uploadPrescription(file: File): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch('/api/upload', { method: 'POST', body: fd });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Upload failed');
  }
  const data = await res.json();
  return data.url as string;
}

export function BloodRequestForm() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pincode, setPincode] = useState('');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState('');
  const [bloodType, setBloodType] = useState<BloodType>();
  const [quantity, setQuantity] = useState(1);
  const [patientName, setPatientName] = useState('');
  const [governmentId, setGovernmentId] = useState('');
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [prescriptionUrl, setPrescriptionUrl] = useState('');
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isLoadingHospitals, setIsLoadingHospitals] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasSearched, setHasSearched] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!pincode || pincode.length < 3) newErrors.pincode = 'Please enter a valid pincode';
    if (!selectedHospital) newErrors.hospital = 'Please select a hospital';
    if (!bloodType) newErrors.bloodType = 'Please select blood type';
    if (!patientName) newErrors.patientName = 'Please enter patient name';
    if (!governmentId) newErrors.governmentId = 'Government ID is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormComplete = () =>
    pincode.length >= 3 && selectedHospital && bloodType && patientName && governmentId;

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

  const handleFileSelect = async (file: File) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      toast.error('Only JPG, PNG, WEBP, or PDF files are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File must be under 5 MB.');
      return;
    }
    setPrescriptionFile(file);
    setIsUploadingFile(true);
    try {
      const url = await uploadPrescription(file);
      setPrescriptionUrl(url);
      toast.success('Prescription uploaded!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      toast.error(msg);
      setPrescriptionFile(null);
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) { toast.error('Please sign in to request blood'); return; }
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const hospital = hospitals.find(h => h.id === selectedHospital);
      if (!hospital) throw new Error('Hospital not found');
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hospitalId: selectedHospital,
          bloodType,
          quantity,
          patientName,
          governmentId,
          prescriptionUrl: prescriptionUrl || null,
          urgency: 'normal',
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit request');
      }
      await response.json();
      toast.success('Blood request submitted successfully!');
      setIsSuccess(true);
      setPincode(''); setSelectedHospital(''); setBloodType(undefined);
      setQuantity(1); setPatientName(''); setGovernmentId('');
      setPrescriptionFile(null); setPrescriptionUrl('');
      setHospitals([]); setErrors({}); setHasSearched(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => router.push('/dashboard/user/userrequests'), 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, router]);

  if (isSuccess) {
    return (
      <div className="flex-1 bg-gray-50 h-full p-4 lg:p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Received!</h2>
          <p className="text-gray-600 mb-6">
            Your blood request has been received. Our team will contact you shortly.
            <br />
            <span className="text-sm text-gray-500">Redirecting in 5 seconds...</span>
          </p>
          <Button onClick={() => router.push('/dashboard/user/userrequests')} className="bg-red-600 hover:bg-red-700 text-white w-full">
            Go to My Requests
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 h-full p-4 lg:p-6">
      <div className="mx-auto w-full max-w-[1920px] space-y-8">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Request Blood</h1>
            <p className="text-gray-600 mt-1">Submit a blood request and our team will arrange supply from the nearest bank.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-50 rounded-lg border border-red-100">
              <Droplet className="h-4 w-4 text-red-500 flex-shrink-0" />
              <span className="text-sm font-medium text-red-700">Verified Process</span>
            </div>
            <div className="p-2.5 rounded-full bg-white border border-gray-200 text-red-600">
              <HeartPulse className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* ── Form ── */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-5 bg-red-600 rounded-full inline-block"></span>
            Blood Request Details
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
                  className="bg-white text-gray-900 h-10 text-sm border-gray-300 flex-1"
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
                  <SelectTrigger id="hospital" className="bg-white text-gray-900 h-10 text-sm border-gray-300 mt-2">
                    <SelectValue placeholder="Choose a nearby hospital" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-gray-900 border-gray-200">
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
                <Label htmlFor="bloodType" className="text-sm font-medium text-gray-700">Blood Type Needed *</Label>
                <Select
                  value={bloodType}
                  onValueChange={(v: BloodType) => { setBloodType(v); setErrors(prev => ({ ...prev, bloodType: '' })); }}
                >
                  <SelectTrigger id="bloodType" className="bg-white text-gray-900 h-10 text-sm border-gray-300 mt-2">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-gray-900 border-gray-200">
                    {Object.values(BloodType).map(t => (
                      <SelectItem key={t} value={t} className="text-sm text-gray-900">{t.replace('_', ' ')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.bloodType && <p className="text-xs text-red-500 mt-1.5">{errors.bloodType}</p>}
              </div>
              <div>
                <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">Units Required *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={e => setQuantity(Math.min(10, Math.max(1, Number(e.target.value))))}
                  className="bg-white text-gray-900 h-10 text-sm border-gray-300 mt-2"
                />
              </div>
            </div>

            {/* Patient Name & Government ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="patientName" className="text-sm font-medium text-gray-700">Patient Full Name *</Label>
                <Input
                  id="patientName"
                  value={patientName}
                  onChange={e => { setPatientName(e.target.value); setErrors(prev => ({ ...prev, patientName: '' })); }}
                  placeholder="Enter patient's full name"
                  className="bg-white text-gray-900 h-10 text-sm border-gray-300 mt-2"
                />
                {errors.patientName && <p className="text-xs text-red-500 mt-1.5">{errors.patientName}</p>}
              </div>
              <div>
                <Label htmlFor="governmentId" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5" />
                  Government ID Number *
                </Label>
                <Input
                  id="governmentId"
                  value={governmentId}
                  onChange={e => { setGovernmentId(e.target.value); setErrors(prev => ({ ...prev, governmentId: '' })); }}
                  placeholder="Aadhaar / PAN / Passport number"
                  className="bg-white text-gray-900 h-10 text-sm border-gray-300 mt-2"
                />
                {errors.governmentId && <p className="text-xs text-red-500 mt-1.5">{errors.governmentId}</p>}
              </div>
            </div>

            {/* Prescription / Slip Upload */}
            <div>
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-2">
                <FileText className="h-3.5 w-3.5" />
                Prescription / Doctor&apos;s Slip
                <span className="text-gray-400 font-normal">(Optional — JPG, PNG, PDF · max 5 MB)</span>
              </Label>

              {!prescriptionFile ? (
                /* Drop zone */
                <div
                  onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={e => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files[0];
                    if (file) handleFileSelect(file);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`cursor-pointer flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 transition-colors ${isDragging
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                    }`}
                >
                  <UploadCloud className={`h-8 w-8 ${isDragging ? 'text-red-500' : 'text-gray-400'}`} />
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">Click to upload or drag &amp; drop</p>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG, WEBP, or PDF up to 5 MB</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                  />
                </div>
              ) : (
                /* File uploaded — preview card */
                <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    {isUploadingFile ? (
                      <Loader2 className="h-8 w-8 text-red-500 animate-spin flex-shrink-0" />
                    ) : (
                      <div className="p-2 bg-red-50 rounded-lg flex-shrink-0">
                        <FileImage className="h-5 w-5 text-red-600" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[220px]">{prescriptionFile.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {isUploadingFile ? 'Uploading...' : (
                          prescriptionUrl
                            ? <span className="text-green-600 font-medium">✓ Uploaded successfully</span>
                            : 'Processing...'
                        )}
                      </p>
                    </div>
                  </div>
                  {!isUploadingFile && (
                    <button
                      type="button"
                      onClick={() => { setPrescriptionFile(null); setPrescriptionUrl(''); }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Submit */}
            <div>
              <Button
                type="submit"
                disabled={!isFormComplete() || isSubmitting || !isSignedIn || isUploadingFile}
                className={`w-full h-11 text-sm font-semibold transition-all ${isFormComplete() && isSignedIn && !isUploadingFile
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gray-100 cursor-not-allowed text-gray-400'
                  }`}
              >
                {isSubmitting
                  ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</>
                  : isUploadingFile
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading file...</>
                    : 'Submit Blood Request'
                }
              </Button>
              {!isSignedIn && (
                <p className="text-sm text-red-600 text-center mt-2">Please sign in to submit a blood request.</p>
              )}
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
