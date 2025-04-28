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
import { RequestStatus, BloodType } from '@prisma/client';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface UserDetails {
  firstName?: string | null;
  lastName?: string | null;
  email: string;
}

interface AddressDetails {
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

interface BloodRequest {
  id: string;
  bloodType: BloodType;
  quantity: number;
  status: RequestStatus;
  urgency: string;
  hospital?: string | null;
  patientName?: string | null;
  reason?: string | null;
  createdAt: Date;
  user: UserDetails;
  address: AddressDetails;
  assignedTo?: string | null;
  fulfilledAt?: Date | null;
}

export default function RequestStatusPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/requests');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: BloodRequest[] = await response.json();

      const fixedData = data
        .map((req) => ({
          ...req,
          createdAt: new Date(req.createdAt),
          fulfilledAt: req.fulfilledAt ? new Date(req.fulfilledAt) : null,
        }))
        .sort((a, b) => {
          if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
          if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

      setRequests(fixedData);
    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        title: 'Error',
        description: 'Could not load requests. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (requestId: string, newStatus: RequestStatus) => {
    setUpdating(prev => ({ ...prev, [requestId]: true }));
    try {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const updatedRequest: BloodRequest = await response.json();

      const fixedRequest = {
        ...updatedRequest,
        createdAt: new Date(updatedRequest.createdAt),
        fulfilledAt: updatedRequest.fulfilledAt ? new Date(updatedRequest.fulfilledAt) : null,
      };

      setRequests(prev =>
        prev.map(request => (request.id === requestId ? fixedRequest : request))
      );
      toast({
        title: 'Success',
        description: `Request status updated to ${newStatus.toLowerCase()}`,
      });
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: 'Error',
        description: 'Failed to update request status',
        variant: 'destructive',
      });
    } finally {
      setUpdating(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const getStatusBadgeStyle = (status: RequestStatus) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      APPROVED: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      FULFILLED: 'bg-green-100 text-green-800 hover:bg-green-200',
      REJECTED: 'bg-red-100 text-red-800 hover:bg-red-200',
    };
    return styles[status] || 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  };

  const getUrgencyBadgeStyle = (urgency: string) => {
    const urgencyLower = urgency.toLowerCase();
    const styles = {
      urgent: 'bg-orange-100 text-orange-800',
      emergency: 'bg-red-100 text-red-800',
    };
    return styles[urgencyLower as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const formatPatientName = (request: BloodRequest) => {
    if (request.patientName) return request.patientName;
    const userName = `${request.user.firstName || ''} ${request.user.lastName || ''}`.trim();
    return userName || request.user.email.split('@')[0];
  };

  const formatAddress = (address: AddressDetails) => {
    return [address.street, address.city, `${address.state} - ${address.postalCode}`]
      .filter(Boolean)
      .join(', ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Blood Requests Management</h1>
      </div>

    {/* Search + Refresh */}
<div className="flex justify-between items-center mb-4">
  <Input
    type="text"
    placeholder="Search by patient name..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="max-w-sm bg-white"
  />
  <Button onClick={fetchRequests} disabled={loading} variant="outline">
    {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
    Refresh
  </Button>
</div>

      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[180px]">Patient</TableHead>
              <TableHead>Blood Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Hospital</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Urgency</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Request Date</TableHead>
              <TableHead>Assigned To</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests
              .filter(request =>
                formatPatientName(request).toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(request => (
                <TableRow key={request.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {formatPatientName(request)}
                  </TableCell>
                  <TableCell>
                    <span className="capitalize">
                      {request.bloodType.toLowerCase().replace('_', ' ')}
                    </span>
                  </TableCell>
                  <TableCell>{request.quantity} units</TableCell>
                  <TableCell>{request.hospital || 'Not specified'}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {formatAddress(request.address)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs capitalize ${getUrgencyBadgeStyle(
                        request.urgency
                      )}`}
                    >
                      {request.urgency.toLowerCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 min-w-[180px]">
                      <Select
                        value={request.status}
                        onValueChange={(value: RequestStatus) =>
                          handleStatusChange(request.id, value)
                        }
                        disabled={updating[request.id] || request.status === 'FULFILLED'}
                      >
                        <SelectTrigger className={`w-full ${getStatusBadgeStyle(request.status)}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(RequestStatus).map(status => (
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
                      {updating[request.id] && <Loader2 className="h-4 w-4 animate-spin" />}
                    </div>
                  </TableCell>
                  <TableCell>
                    {request.createdAt.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>{request.assignedTo || 'Not assigned'}</TableCell>
                </TableRow>
              ))}
            {requests.filter(request =>
              formatPatientName(request).toLowerCase().includes(searchQuery.toLowerCase())
            ).length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                  No blood requests found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
