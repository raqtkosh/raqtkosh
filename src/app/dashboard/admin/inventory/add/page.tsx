'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { BloodType } from '@prisma/client';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { CenterCombobox } from '@/components/center-combobox';

export default function AddBloodStockPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    centerId: '',
    bloodType: 'A_POSITIVE' as BloodType,
    quantity: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.centerId || formData.quantity < 1) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update inventory');
      }

      toast({ 
        title: 'Success', 
        description: 'Inventory updated successfully' 
      });
      router.push('/dashboard/admin/inventory');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Add Blood Stock</h1>
        <Button 
          variant="outline" 
          onClick={() => router.push('/dashboard/admin/inventory')}
        >
          Back to Inventory
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Donation Center *
          </label>
          <CenterCombobox
            value={formData.centerId}
            onChange={centerId => setFormData({...formData, centerId})}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Blood Type *
          </label>
          <Select
            value={formData.bloodType}
            onValueChange={(value: BloodType) => 
              setFormData({...formData, bloodType: value})
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select blood type" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black border border-gray-300 rounded-md shadow-md">
              {Object.values(BloodType).map(type => (
                <SelectItem key={type} value={type}>
                  {type.split('_').join(' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Quantity (units) *
          </label>
          <Input
            type="number"
             className="bg-white text-black"
            min="1"
            value={formData.quantity}
            onChange={e => setFormData({
              ...formData,
              quantity: Math.max(1, Number(e.target.value))
            })}
            required
          />
        </div>

        <div className="flex justify-end gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/admin/inventory')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={saving}
            className="min-w-[120px]"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Add Stock'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}