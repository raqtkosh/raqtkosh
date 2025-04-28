'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function AdminRequestActions({ requestId }: { requestId: string }) {
  const [loading, setLoading] = useState(false);

  const handleNotifyUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/requests/notify-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send notifications');
      }

      toast({
        title: 'Success',
        description: data.message,
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  return (
    <Button
      onClick={handleNotifyUsers}
      disabled={loading}
      variant="destructive"
      className="mt-2"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sending...
        </>
      ) : (
        'Notify Matching Donors'
      )}
    </Button>
  );
}