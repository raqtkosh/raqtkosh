'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from '@/components/ui/command';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DonationCenter {
  id: string;
  name: string;
  city: string;
  state: string;
}

export function CenterCombobox({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (value: string) => void 
}) {
  const [open, setOpen] = useState(false);
  const [centers, setCenters] = useState<DonationCenter[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchCenters = useCallback(async (query: string, pageNum: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/inventory/donation-centers?query=${encodeURIComponent(query)}&page=${pageNum}`
      );
      if (!response.ok) throw new Error('Failed to fetch centers');
      
      const { centers: newCenters, hasMore: more } = await response.json();
      setCenters(prev => pageNum === 1 ? newCenters : [...prev, ...newCenters]);
      setHasMore(more);
    } catch (error) {
      console.error('Error fetching centers:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchCenters(searchQuery, 1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchCenters]);

  const selectedCenter = centers.find(c => c.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCenter ? (
            <span className="truncate">
              {selectedCenter.name} ({selectedCenter.city}, {selectedCenter.state})
            </span>
          ) : (
            'Select donation center...'
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 bg-white text-black border border-gray-300 rounded-md shadow-md" align="start">
  <Command shouldFilter={false} className="bg-white text-black">
    <CommandInput
      placeholder="Search centers by name or city..."
      value={searchQuery}
      onValueChange={setSearchQuery}
    />
    <CommandList>
            {loading && centers.length === 0 ? (
              <div className="py-6 text-center text-sm">
                <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" />
                Loading...
              </div>
            ) : centers.length === 0 ? (
              <CommandEmpty>No centers found</CommandEmpty>
            ) : (
              <CommandGroup>
                {centers.map(center => (
                  <CommandItem
                    key={center.id}
                    value={center.id}
                    onSelect={() => {
                      onChange(center.id);
                      setOpen(false);
                    }}
                  >
                    <Check 
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === center.id ? 'opacity-100' : 'opacity-0'
                      )} 
                    />
                    <div className="flex-1">
                      <div className="font-medium">{center.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {center.city}, {center.state}
                      </div>
                    </div>
                  </CommandItem>
                ))}
                {hasMore && (
                  <CommandItem
                    onSelect={() => {
                      const nextPage = page + 1;
                      setPage(nextPage);
                      fetchCenters(searchQuery, nextPage);
                    }}
                    className="text-center text-sm text-muted-foreground justify-center"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Load more...'
                    )}
                  </CommandItem>
                )}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}