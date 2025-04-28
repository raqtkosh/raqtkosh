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
import { toast } from 'sonner';
import { Loader2, HeartPulse, CheckCircle } from 'lucide-react';
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

export function BloodRequestForm() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const [pincode, setPincode] = useState('');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState('');
  const [bloodType, setBloodType] = useState<BloodType>();
  const [quantity, setQuantity] = useState(1);
  const [patientName, setPatientName] = useState('');
  const [isLoadingHospitals, setIsLoadingHospitals] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasSearched, setHasSearched] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!pincode || pincode.length < 3) newErrors.pincode = 'Please enter a valid pincode';
    if (!selectedHospital) newErrors.hospital = 'Please select a hospital';
    if (!bloodType) newErrors.bloodType = 'Please select blood type';
    if (!patientName) newErrors.patientName = 'Please enter patient name';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormComplete = () => {
    return pincode.length >= 3 && selectedHospital && bloodType && patientName;
  };

  const fetchHospitals = async () => {
    if (pincode.length < 3) {
      setErrors(prev => ({...prev, pincode: 'Pincode must be at least 3 digits'}));
      return;
    }
    setIsLoadingHospitals(true);
    setHasSearched(true);
    try {
      const response = await fetch(`/api/hospitals?pincode=${pincode}`);
      if (!response.ok) throw new Error('Failed to fetch hospitals');
      const data = await response.json();
      setHospitals(data);
      setErrors(prev => ({...prev, pincode: ''}));
    } catch (error) {
      toast.error('Failed to load hospitals. Please try again.');
      setHospitals([]);
      setErrors(prev => ({...prev, pincode: 'Failed to fetch hospitals for this pincode'}));
    } finally {
      setIsLoadingHospitals(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSignedIn) {
      toast.error('Please sign in to request blood');
      return;
    }
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const hospital = hospitals.find(h => h.id === selectedHospital);
      if (!hospital) throw new Error('Hospital not found');

      const response = await fetch('/api/createrequest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hospitalId: selectedHospital,
          bloodType,
          quantity,
          patientName
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit request');
      }

      await response.json();
      toast.success('Blood request submitted successfully!');
      setIsSuccess(true);

      // Reset form
      setPincode('');
      setSelectedHospital('');
      setBloodType(undefined);
      setQuantity(1);
      setPatientName('');
      setHospitals([]);
      setErrors({});
      setHasSearched(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        router.push('/dashboard/user/userrequests');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, router]);

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Received!</h2>
        <p className="text-gray-700 mb-6">
          Your blood request has been received. Our team will contact you shortly.
          <br />
          <span className="text-sm text-gray-500">Redirecting to requests page in 5 seconds...</span>
        </p>
        <Button 
          onClick={() => router.push('/dashboard/user/userrequests')}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Go to Requests Now
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <HeartPulse className="h-6 w-6 text-red-600" />
        <h1 className="text-xl font-bold text-gray-900">Blood Request Form</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Pincode Search */}
        <div className="space-y-2">
          <Label htmlFor="pincode" className="text-gray-900">
            Search Hospitals by Pincode *
          </Label>
          <div className="flex gap-2">
            <Input
              id="pincode"
              value={pincode}
              onChange={(e) => {
                setPincode(e.target.value);
                setErrors(prev => ({...prev, pincode: ''}));
              }}
              placeholder="Enter 6-digit pincode"
              minLength={3}
              maxLength={6}
              required
              className="bg-white text-gray-900 border border-gray-300 focus:ring-red-500 focus:border-red-500"
            />
            <Button
              type="button"
              onClick={fetchHospitals}
              disabled={pincode.length < 3 || isLoadingHospitals}
            >
              {isLoadingHospitals ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Search'
              )}
            </Button>
          </div>
          {errors.pincode && <p className="text-sm text-red-500">{errors.pincode}</p>}
        </div>

        {/* Hospital Selection */}
        {hospitals.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="hospital" className="text-gray-900">
              Select Hospital *
            </Label>
            <Select
              value={selectedHospital}
              onValueChange={(value) => {
                setSelectedHospital(value);
                setErrors(prev => ({...prev, hospital: ''}));
              }}
              required
            >
              <SelectTrigger id="hospital" className="bg-white text-gray-900 border border-gray-300">
                <SelectValue placeholder="Select a hospital" />
              </SelectTrigger>
              <SelectContent className="bg-white text-gray-900">
                {hospitals.map((hospital) => (
                  <SelectItem 
                    key={hospital.id} 
                    value={hospital.id}
                    className="text-gray-900 bg-white hover:bg-gray-100"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{hospital.name}</span>
                      <span className="text-sm text-gray-600">
                        {hospital.address}, {hospital.city}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.hospital && <p className="text-sm text-red-500">{errors.hospital}</p>}
          </div>
        )}

        {/* No Hospitals Found */}
        {hasSearched && hospitals.length === 0 && !isLoadingHospitals && (
          <div className="text-center text-gray-600 mt-4">
            <p>No hospitals found nearby for this pincode.</p>
          </div>
        )}

        {/* Blood Type */}
        <div className="space-y-2">
          <Label htmlFor="bloodType" className="text-gray-900">
            Blood Type Needed *
          </Label>
          <Select
            value={bloodType}
            onValueChange={(value: BloodType) => {
              setBloodType(value);
              setErrors(prev => ({...prev, bloodType: ''}));
            }}
            required
          >
            <SelectTrigger id="bloodType" className="bg-white text-gray-900 border border-gray-300">
              <SelectValue placeholder="Select blood type" />
            </SelectTrigger>
            <SelectContent className="bg-white text-gray-900">
              {Object.values(BloodType).map((type) => (
                <SelectItem 
                  key={type} 
                  value={type}
                  className="text-gray-900 bg-white hover:bg-gray-100"
                >
                  {type.replace('_', '+')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.bloodType && <p className="text-sm text-red-500">{errors.bloodType}</p>}
        </div>

        {/* Quantity */}
        <div className="space-y-2">
          <Label htmlFor="quantity" className="text-gray-900">
            Quantity (Units) *
          </Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            max="10"
            value={quantity}
            onChange={(e) => setQuantity(Math.min(10, Math.max(1, Number(e.target.value))))}
            required
            className="bg-white text-gray-900 border border-gray-300 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        {/* Patient Name */}
        <div className="space-y-2">
          <Label htmlFor="patientName" className="text-gray-900">
            Patient Name *
          </Label>
          <Input
            id="patientName"
            value={patientName}
            onChange={(e) => {
              setPatientName(e.target.value);
              setErrors(prev => ({...prev, patientName: ''}));
            }}
            placeholder="Enter patient's full name"
            required
            className="bg-white text-gray-900 border border-gray-300 focus:ring-red-500 focus:border-red-500"
          />
          {errors.patientName && <p className="text-sm text-red-500">{errors.patientName}</p>}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className={`w-full py-2 ${
            isFormComplete() && isSignedIn 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-gray-400 cursor-not-allowed text-white'
          }`}
          disabled={!isFormComplete() || isSubmitting || !isSignedIn}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Blood Request'
          )}
        </Button>

        {!isSignedIn && (
          <p className="text-sm text-red-600 text-center">
            Please sign in to submit a request
          </p>
        )}
      </form>
    </div>
  );
}
