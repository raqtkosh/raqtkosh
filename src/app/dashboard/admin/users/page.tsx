'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ChevronDown,
  Search,
  Edit,
  MoreVertical,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Role, BloodType, RewardTier } from '@prisma/client';

type User = {
  id: string;
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  bloodType: BloodType | null;
  role: Role;
  points: number;
  rewardTier: RewardTier | null;
  lastDonation: Date | null;
  nextDonation: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<Role | 'ALL'>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, roleFilter, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const refreshUsers = async () => {
    setIsRefreshing(true);
    await fetchUsers();
    setIsRefreshing(false);
  };

  const filterUsers = () => {
    let result = [...users];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => (
        user.email.toLowerCase().includes(term) ||
        (user.firstName && user.firstName.toLowerCase().includes(term)) ||
        (user.lastName && user.lastName.toLowerCase().includes(term)) ||
        (user.phoneNumber && user.phoneNumber.includes(term))
      ));
    }

    if (roleFilter !== 'ALL') {
      result = result.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(result);
  };

  const handleEditUser = () => {
    alert('Edit functionality is currently in development state');
  };

  const getRoleBadgeVariant = (role: Role) => {
    switch (role) {
      case 'ADMIN': return 'default';
      case 'SUPER_ADMIN': return 'default';
      case 'HOSPITAL': return 'secondary';
      default: return 'outline';
    }
  };

  const getBloodTypeDisplay = (bloodType: BloodType | null) => {
    if (!bloodType) return 'N/A';
    return bloodType.split('_').join(' ');
  };

  if (loading && !isRefreshing) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button
          onClick={() => alert('Update it from database')}
          disabled
          className="relative group"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add User
          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
            Update it from database
          </span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-black" />
              <Input
                placeholder="Search users..."
                className="pl-8 bg-white text-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  {roleFilter === 'ALL' ? 'All Roles' : roleFilter}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="text-black bg-gray-100 border border-black">
                <DropdownMenuItem onClick={() => setRoleFilter('ALL')}>
                  All Roles
                </DropdownMenuItem>
                {Object.values(Role).map((role) => (
                  <DropdownMenuItem
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    className="text-black"
                  >
                    {role}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" onClick={refreshUsers} disabled={isRefreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <div className="rounded-md border border-black">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Name</TableHead>
                  <TableHead className="font-bold">Email</TableHead>
                  <TableHead className="font-bold">Phone</TableHead>
                  <TableHead className="font-bold">Blood Type</TableHead>
                  <TableHead className="font-bold">Role</TableHead>
                  <TableHead className="font-bold">Points</TableHead>
                  <TableHead className="font-bold">Joined</TableHead>
                  <TableHead className="font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.firstName || 'N/A'} {user.lastName || ''}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phoneNumber || 'N/A'}</TableCell>
                      <TableCell>{getBloodTypeDisplay(user.bloodType)}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.points}</TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleEditUser}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
