'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { BloodType } from '@prisma/client';

export default function CreateBloodRequestPage() {
  const [bloodType, setBloodType] = useState<BloodType>();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    status: 'success' | 'empty' | null;
    message: string;
    bloodType: string;
    donorCount?: number;
  }>({
    status: null,
    message: '',
    bloodType: '',
  });

  const handleSubmit = async () => {
    if (!bloodType) {
      toast({
        title: 'Error',
        description: 'Please select blood type',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setResult({ status: null, message: '', bloodType: '' });

    try {
      const response = await fetch('/api/admin/blood-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bloodType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send notifications');
      }

      if (data.donorCount > 0) {
        setResult({
          status: 'success',
          message: `Notified ${data.donorCount} donors with ${data.bloodType.replace('_', '-')} blood type.`,
          bloodType: data.bloodType,
          donorCount: data.donorCount
        });

        toast({
          title: 'Success!',
          description: data.message,
        });

      } else {
        setResult({
          status: 'empty',
          message: `No donor registered with ${data.bloodType.replace('_', '-')} blood group.`,
          bloodType: data.bloodType
        });

        toast({
          title: 'No Donors Available',
          description: `Currently we don't have any users with ${data.bloodType.replace('_', '-')} blood group.`,
          variant: 'destructive',
        });
      }

      setBloodType(undefined);

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewRequest = () => {
    setResult({ status: null, message: '', bloodType: '' });
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Create Blood Request</h1>

      <div className="space-y-6 bg-white p-6 rounded-lg shadow">
        {result.status === 'success' && (
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Request Successful!</h3>
            <p className="text-sm text-gray-500">{result.message}</p>
            <Button 
              onClick={handleNewRequest}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Create Another Request
            </Button>
          </div>
        )}

        {result.status === 'empty' && (
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No Donors Found</h3>
            <p className="text-sm text-gray-500">{result.message}</p>
            <Button 
              onClick={handleNewRequest}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Try Another Blood Group
            </Button>
          </div>
        )}

        {result.status === null && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Blood Type *</label>
              <Select 
                value={bloodType} 
                onValueChange={(value) => setBloodType(value as BloodType)}
              >
                <SelectTrigger className="w-full text-black bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder="Select blood type" className="text-black" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg">
                  {Object.values(BloodType).map(type => (
                    <SelectItem 
                      key={type} 
                      value={type}
                      className="text-black hover:bg-gray-100 focus:bg-gray-100"
                    >
                      {type.replace('_', '-')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleSubmit}
              disabled={loading || !bloodType}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Sending Notifications...
                </>
              ) : 'Notify Matching Donors'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
