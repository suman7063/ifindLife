import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Search, 
  Edit, 
  Eye, 
  Ban, 
  Trash2, 
  UserX, 
  RefreshCw,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface ExpertData {
  id: string;
  auth_id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  specialization?: string;
  experience?: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  average_rating?: number;
  reviews_count?: number;
  verified?: boolean;
  created_at?: string;
  profile_picture?: string;
  services_count?: number;
}

const ExpertManagement: React.FC = () => {
  const [experts, setExperts] = useState<ExpertData[]>([]);
  const [filteredExperts, setFilteredExperts] = useState<ExpertData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [selectedExpert, setSelectedExpert] = useState<ExpertData | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [expertServices, setExpertServices] = useState<Array<{ id: string; name: string; is_primary: boolean }>>([]);
  const [loadingServices, setLoadingServices] = useState(false);

  useEffect(() => {
    fetchExperts();
  }, []);

  useEffect(() => {
    filterAndSortExperts();
  }, [experts, searchTerm, statusFilter, sortBy]);

  const fetchExperts = async () => {
    setLoading(true);
    try {
      // Use RPC function that has SECURITY DEFINER for admin access
      const { data: allData, error } = await supabase
        .rpc('admin_list_all_experts');

      if (error) throw error;
      
      // Filter out pending experts (as the original code did)
      const nonPendingExperts = (allData || []).filter((expert: any) => expert.status !== 'pending');
      
      // Fetch services count for each expert from both tables
      const expertIds = nonPendingExperts.map((expert: any) => expert.auth_id);
      
      // Fetch from expert_service_specializations (expert selected during onboarding)
      const { data: specializationsData, error: specError } = await supabase
        .from('expert_service_specializations')
        .select('expert_id')
        .in('expert_id', expertIds)
        .eq('is_available', true);

      if (specError) {
        console.error('Error fetching specializations count:', specError);
      }

      // Fetch from admin_expert_service_assignments (admin assigned services like retreats)
      const { data: expertServicesData, error: expertServicesError } = await supabase
        .from('admin_expert_service_assignments')
        .select('expert_id')
        .in('expert_id', expertIds)
        .eq('is_active', true);

      if (expertServicesError) {
        console.error('Error fetching expert services count:', expertServicesError);
      }

      // Count services per expert from both sources
      const servicesCountMap = new Map<string, number>();
      
      // Count from expert_service_specializations
      (specializationsData || []).forEach((item: any) => {
        const count = servicesCountMap.get(item.expert_id) || 0;
        servicesCountMap.set(item.expert_id, count + 1);
      });

      // Count from expert_services (avoid duplicates by using Set)
      const expertServicesSet = new Map<string, Set<string>>();
      (expertServicesData || []).forEach((item: any) => {
        if (!expertServicesSet.has(item.expert_id)) {
          expertServicesSet.set(item.expert_id, new Set());
        }
        // We're just counting, so we can add to the count directly
        const count = servicesCountMap.get(item.expert_id) || 0;
        servicesCountMap.set(item.expert_id, count + 1);
      });

      // Add services count to experts
      const expertsWithServices = nonPendingExperts.map((expert: any) => ({
        ...expert,
        services_count: servicesCountMap.get(expert.auth_id) || 0
      }));

      setExperts(expertsWithServices as ExpertData[]);
    } catch (error) {
      console.error('Error fetching experts:', error);
      toast.error('Failed to load experts');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortExperts = () => {
    let filtered = experts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(expert =>
        expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expert.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expert.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expert.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(expert => expert.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'email':
          return a.email.localeCompare(b.email);
        case 'rating':
          return (b.average_rating || 0) - (a.average_rating || 0);
        case 'reviews':
          return (b.reviews_count || 0) - (a.reviews_count || 0);
        case 'created':
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
        default:
          return 0;
      }
    });

    setFilteredExperts(filtered);
  };

  const handleStatusUpdate = async (expertId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('expert_accounts')
        .update({ status: newStatus })
        .eq('auth_id', expertId);

      if (error) throw error;

      toast.success(`Expert ${newStatus} successfully`);
      fetchExperts();
    } catch (error) {
      console.error('Error updating expert status:', error);
      toast.error('Failed to update expert status');
    }
  };

  const handleDeleteExpert = async (expertId: string) => {
    try {
      const { error } = await supabase
        .from('expert_accounts')
        .delete()
        .eq('auth_id', expertId);

      if (error) throw error;

      toast.success('Expert deleted successfully');
      fetchExperts();
    } catch (error) {
      console.error('Error deleting expert:', error);
      toast.error('Failed to delete expert');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      suspended: 'bg-yellow-100 text-yellow-800',
    };
    
    return (
      <Badge className={styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleViewDetails = async (expert: ExpertData) => {
    setSelectedExpert(expert);
    setIsDetailsDialogOpen(true);
    await fetchExpertServices(expert.auth_id);
  };

  const fetchExpertServices = async (expertId: string) => {
    setLoadingServices(true);
    try {
      const allServices: Array<{ id: string; name: string; is_primary: boolean; source: string }> = [];

      // Fetch from expert_service_specializations (expert selected during onboarding)
      const { data: specData, error: specErr } = await supabase
        .from('expert_service_specializations')
        .select('service_id, is_primary_service')
        .eq('expert_id', expertId)
        .eq('is_available', true);

      if (specErr) {
        console.error('Error fetching specializations:', specErr);
      } else if (specData && specData.length > 0) {
        const serviceIds = specData.map(s => s.service_id);
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('id, name')
          .in('id', serviceIds);

        if (servicesError) {
          console.error('Error fetching service names for specializations:', servicesError);
        } else {
          const services = (servicesData || []).map(service => {
            const spec = specData.find(s => s.service_id === service.id);
            return {
              id: service.id,
              name: service.name,
              is_primary: spec?.is_primary_service || false,
              source: 'Onboarding'
            };
          });
          allServices.push(...services);
        }
      }

      // Fetch from admin_expert_service_assignments (admin assigned services like retreats)
      const { data: expertServicesData, error: expertServicesErr } = await supabase
        .from('admin_expert_service_assignments')
        .select('service_id')
        .eq('expert_id', expertId)
        .eq('is_active', true);

      if (expertServicesErr) {
        console.error('Error fetching expert services:', expertServicesErr);
      } else if (expertServicesData && expertServicesData.length > 0) {
        const serviceIds = expertServicesData.map(s => s.service_id);
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('id, name')
          .in('id', serviceIds);

        if (servicesError) {
          console.error('Error fetching service names for admin_expert_service_assignments:', servicesError);
        } else {
          // Only add services that aren't already in the list (avoid duplicates)
          const existingIds = new Set(allServices.map(s => s.id));
          const newServices = (servicesData || [])
            .filter(service => !existingIds.has(service.id))
            .map(service => ({
              id: service.id,
              name: service.name,
              is_primary: false,
              source: 'Admin Assigned'
            }));
          allServices.push(...newServices);
        }
      }

      setExpertServices(allServices);
    } catch (error) {
      console.error('Error fetching expert services:', error);
      setExpertServices([]);
    } finally {
      setLoadingServices(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading experts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Expert Management</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage approved experts, their status, and view detailed information
              </p>
            </div>
            <Button onClick={fetchExperts} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, email, expertise, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="reviews">Reviews</SelectItem>
                <SelectItem value="created">Date Added</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Summary */}
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {filteredExperts.length} of {experts.length} experts
          </div>

          {/* Experts Table */}
          <div className="border rounded-lg overflow-x-auto">
            <div className="min-w-full inline-block">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Expert</TableHead>
                  <TableHead className="min-w-[200px]">Contact</TableHead>
                  <TableHead className="min-w-[100px]">Services</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="text-right min-w-[140px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExperts.map((expert) => (
                  <TableRow key={expert.auth_id || `expert-${expert.email}`}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {expert.profile_picture ? (
                            <img 
                              src={expert.profile_picture} 
                              alt={expert.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-medium text-gray-600">
                              {expert.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{expert.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {expert.experience} years experience
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{expert.email}</div>
                        {expert.phone && (
                          <div className="text-muted-foreground">{expert.phone}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <Badge variant="outline">
                          {expert.services_count || 0} service{expert.services_count !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(expert.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(expert)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {expert.status === 'approved' && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Ban className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Suspend Expert</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to suspend {expert.name}? They will not be able to accept new appointments.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleStatusUpdate(expert.auth_id, 'suspended')}
                                >
                                  Suspend
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}

                        {expert.status === 'suspended' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(expert.auth_id, 'approved')}
                          >
                            Reactivate
                          </Button>
                        )}

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Expert</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to permanently delete {expert.name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteExpert(expert.auth_id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete Permanently
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </div>

          {filteredExperts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm || statusFilter !== 'all' ? 
                'No experts match your search criteria' : 
                'No experts found'
              }
            </div>
          )}
        </CardContent>
      </Card>

      {/* Expert Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Expert Details</DialogTitle>
          </DialogHeader>
          {selectedExpert && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                  {selectedExpert.profile_picture ? (
                    <img 
                      src={selectedExpert.profile_picture} 
                      alt={selectedExpert.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-medium text-gray-600">
                      {selectedExpert.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedExpert.name}</h3>
                  <p className="text-muted-foreground">{selectedExpert.specialization}</p>
                  {getStatusBadge(selectedExpert.status)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-medium">Email:</span> {selectedExpert.email}</div>
                    {selectedExpert.phone && (
                      <div><span className="font-medium">Phone:</span> {selectedExpert.phone}</div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Professional Info</h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-medium">Experience:</span> {selectedExpert.experience} years</div>
                    <div><span className="font-medium">Rating:</span> ⭐ {selectedExpert.average_rating?.toFixed(1) || 'N/A'}</div>
                    <div><span className="font-medium">Reviews:</span> {selectedExpert.reviews_count || 0}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Address</h4>
                <div className="text-sm">
                  {selectedExpert.address && <div>{selectedExpert.address}</div>}
                  <div>
                    {[selectedExpert.city, selectedExpert.state, selectedExpert.country]
                      .filter(Boolean)
                      .join(', ')}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Services</h4>
                {loadingServices ? (
                  <div className="text-sm text-muted-foreground">Loading services...</div>
                ) : expertServices.length > 0 ? (
                  <div className="space-y-2">
                    {expertServices.map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{service.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {service.source}
                          </Badge>
                        </div>
                        {service.is_primary && (
                          <Badge variant="outline" className="text-xs bg-blue-100">Primary</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-red-600 font-medium">
                    ⚠️ No services found - Expert needs to complete onboarding service selection
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-medium mb-2">Account Details</h4>
                <div className="space-y-1 text-sm">
                  <div><span className="font-medium">Created:</span> {new Date(selectedExpert.created_at || '').toLocaleDateString()}</div>
                  <div><span className="font-medium">Verified:</span> {selectedExpert.verified ? 'Yes' : 'No'}</div>
                  <div><span className="font-medium">Auth ID:</span> {selectedExpert.auth_id}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpertManagement;