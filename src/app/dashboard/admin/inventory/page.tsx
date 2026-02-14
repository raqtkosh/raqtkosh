'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Loader2, Plus } from 'lucide-react';

interface InventoryItem {
  id: string;
  bloodType: string;
  quantity: number;
  lastUpdated: Date;
  center: {
    name: string;
    city: string;
    state: string;
  };
}

export default function InventoryPage() {
  const router = useRouter();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/inventory');
      
      if (!res.ok) {
        throw new Error('Failed to load inventory');
      }
      
      const data = await res.json();
      setInventory(data);
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: error instanceof Error ? error.message : 'Failed to load inventory', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchInventory(); 
  }, []);

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
        <h1 className="text-2xl font-bold tracking-tight">Blood Inventory</h1>
        <Button onClick={() => router.push('/dashboard/admin/inventory/add')}>
          <Plus className="mr-2 h-4 w-4" /> 
          Add Stock
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[25%]">Center</TableHead>
              <TableHead className="w-[25%]">Location</TableHead>
              <TableHead className="w-[15%]">Blood Type</TableHead>
              <TableHead className="w-[15%] text-right">Units</TableHead>
              <TableHead className="w-[20%]">Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.length > 0 ? (
              inventory.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.center.name}</TableCell>
                  <TableCell>{item.center.city}, {item.center.state}</TableCell>
                  <TableCell>
                    {item.bloodType.split('_').join(' ')}
                  </TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell>
                    {new Date(item.lastUpdated).toLocaleString('en-US', {
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric',
                      hour: '2-digit', 
                      minute: '2-digit'
                    })}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={5} 
                  className="text-center py-8 text-muted-foreground"
                >
                  No inventory records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}