/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DashboardData {
  stats: {
    users: number;
    donations: number;
    requests: number;
  };
  recentActivities: {
    text: string;
    time: Date;
  }[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatTimeAgo = (dateString: Date) => {
    const IST_OFFSET = 5.5 * 60 * 60 * 1000; 
    const date = new Date(new Date(dateString).getTime() + IST_OFFSET);
    const now = new Date(new Date().getTime() + IST_OFFSET);

    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* logout button logout */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      { /* <UserButton afterSignOutUrl="/" /> */}
      </div>

      {/* stats cards users */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { title: 'Total Users', value: data.stats.users },
          { title: 'Blood Donations', value: data.stats.donations },
          { title: 'Blood Requests', value: data.stats.requests },
        ].map((stat) => (
          <Card key={stat.title} className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-gray-800">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* quick action we can manage that further also */}
      <Card className="mb-10 shadow-sm">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button onClick={() => router.push('/dashboard/admin/users')}>
            Users
          </Button>
          <Button onClick={() => router.push('/dashboard/admin/inventory/add')}>
            Add Blood Stock
          </Button>
          <Button onClick={() => router.push('/dashboard/admin/requests')}>
            View Pending Requests
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {data.recentActivities.map((activity, index) => (
              <div key={index} className="border-b pb-4">
                <p className="font-medium text-gray-800">{activity.text}</p>
                <p className="text-sm text-gray-500">
                  {formatTimeAgo(activity.time)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
