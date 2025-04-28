'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface DonationItem {
  id: string;
  date: Date;
  bloodType: string;
  quantity: number;
  status: string;
  pointsEarned: number;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  center: {
    name: string | null;
    city: string | null;
    state: string | null;
  } | null;
}

const STATUS_OPTIONS = ['PENDING', 'COMPLETED', 'CANCELLED', 'REJECTED'];

export default function DonationRequestsPage() {
  const router = useRouter();
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/donation-requests');
      if (!res.ok) throw new Error('Failed to load donations');
      const data = await res.json();
      setDonations(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load donations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateDonationStatus = async (donationId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/donation-requests/${donationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update donation status');
      const updatedDonation = await res.json();
      setDonations(donations.map(donation => donation.id === donationId ? updatedDonation : donation));
      toast({
        title: 'Success',
        description: 'Donation status updated successfully',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const getStatusBadgeStyle = (status: string) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      COMPLETED: 'bg-green-100 text-green-800 hover:bg-green-200',
      CANCELLED: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
      REJECTED: 'bg-red-100 text-red-800 hover:bg-red-200',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  };

  const filteredDonations = donations.filter(donation =>
    `${donation.user.firstName} ${donation.user.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Donation Requests</h1>
      </div>

      {/* Search + Refresh */}
      <div className="flex justify-between items-center mb-6">
        <Input
          type="text"
          placeholder="Search by donor name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm bg-white"
        />
        <Button onClick={fetchDonations} disabled={loading} variant="outline">
          {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Refresh
        </Button>
      </div>

      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[20%]">Donor</TableHead>
              <TableHead className="w-[20%]">Location</TableHead>
              <TableHead className="w-[15%]">Blood Type</TableHead>
              <TableHead className="w-[15%] text-right">Quantity (ml)</TableHead>
              <TableHead className="w-[10%]">Status</TableHead>
              <TableHead className="w-[10%]">Points Earned</TableHead>
              <TableHead className="w-[20%]">Center</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDonations.length > 0 ? (
              filteredDonations.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.user.firstName} {item.user.lastName}</TableCell>
                  <TableCell>
                    {item.center ? `${item.center.city}, ${item.center.state}` : 'Not Assigned'}
                  </TableCell>
                  <TableCell>{item.bloodType.split('_').join(' ')}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell>
                    <Select
                      value={item.status}
                      onValueChange={(value: string) => updateDonationStatus(item.id, value)}
                      disabled={item.status === 'COMPLETED' || item.status === 'CANCELLED'}
                    >
                      <SelectTrigger className={`w-full ${getStatusBadgeStyle(item.status)}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map(status => (
                          <SelectItem
                            key={status}
                            value={status}
                            className={getStatusBadgeStyle(status)}
                          >
                            {status.charAt(0) + status.slice(1).toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-center">{item.pointsEarned}</TableCell>
                  <TableCell>{item.center ? item.center.name : 'No Center Assigned'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No donation records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
