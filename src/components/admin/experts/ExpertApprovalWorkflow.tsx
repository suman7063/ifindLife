import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Mail, 
  FileText,
  Eye,
  Calendar,
  MapPin,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import ExpertDeleteConfirmationModal from './ExpertDeleteConfirmationModal';
import DocumentViewModal from './DocumentViewModal';

interface ExpertApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  category: string;
  specialization: string;
  experience: string;
  bio: string;
  certificate_urls: string[];
  status: 'pending' | 'approved' | 'disapproved';
  created_at: string;
}

interface ExpertCategory {
  id: string;
  name: string;
  description: string;
  base_price_usd: number;
  base_price_inr: number;
  base_price_eur: number;
}

export const ExpertApprovalWorkflow: React.FC = () => {
  const [applications, setApplications] = useState<ExpertApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<ExpertApplication | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'disapproved'>('pending');
  const [rejectionReason, setRejectionReason] = useState('');
  const [categories, setCategories] = useState<ExpertCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    open: boolean;
    expertId: string;
    expertName: string;
  }>({ open: false, expertId: '', expertName: '' });
  const [deleteInput, setDeleteInput] = useState('');
  const [documentModal, setDocumentModal] = useState<{
    open: boolean;
    documents: string[];
    expertName: string;
  }>({ open: false, documents: [], expertName: '' });

  useEffect(() => {
    fetchApplications();
    fetchCategories();
  }, [filterStatus]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('expert_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setApplications((data || []) as ExpertApplication[]);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load expert applications');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('expert_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const handleApproval = async (applicationId: string, action: 'approved' | 'disapproved') => {
    setActionLoading(applicationId);
    
    try {
      const updateData: any = { 
        status: action,
        updated_at: new Date().toISOString()
      };

      // If modifying category during approval, update it
      if (action === 'approved' && selectedCategory) {
        updateData.category = selectedCategory;
      }

      // If rejecting, add the reason to the bio temporarily (you might want a separate rejection_reason field)
      if (action === 'disapproved' && rejectionReason) {
        updateData.rejection_reason = rejectionReason;
      }

      const { error } = await supabase
        .from('expert_accounts')
        .update(updateData)
        .eq('id', applicationId);

      if (error) throw error;

      // Update local state
      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { 
              ...app, 
              status: action, 
              category: selectedCategory || app.category 
            }
          : app
      ));

      // If approved, create initial pricing tier and assign services
      if (action === 'approved') {
        const finalCategory = selectedCategory || applications.find(app => app.id === applicationId)?.category;
        if (finalCategory) {
          await createInitialPricingTier(applicationId, finalCategory);
          await assignCategoryServices(applicationId, finalCategory);
        }
      }

      toast.success(`Expert ${action === 'approved' ? 'approved' : 'rejected'} successfully`);
      setSelectedApp(null);
      setRejectionReason('');
      setSelectedCategory('');
      
      // Refresh the list if we're filtering
      if (filterStatus === 'pending') {
        fetchApplications();
      }
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application status');
    } finally {
      setActionLoading(null);
    }
  };

  const assignCategoryServices = async (expertId: string, category: string) => {
    try {
      // Define category-specific services based on the plan
      const categoryServices: Record<string, number[]> = {
        'listening-volunteer': [1, 2], // Basic listening services
        'listening-expert': [1, 2, 3, 4], // Advanced listening + counseling
        'listening-coach': [1, 2, 3, 4, 5], // All listening + coaching
        'mindfulness-expert': [6, 7, 8] // Mindfulness specific services
      };

      const serviceIds = categoryServices[category] || [];
      
      if (serviceIds.length > 0) {
        // Create service specializations for this expert
        const specializations = serviceIds.map(serviceId => ({
          expert_id: expertId,
          service_id: serviceId,
          is_available: true,
          is_primary_service: serviceId === serviceIds[0], // First service is primary
          proficiency_level: category.includes('expert') ? 'expert' : 
                           category.includes('coach') ? 'advanced' : 'intermediate'
        }));

        const { error } = await supabase
          .from('expert_service_specializations')
          .insert(specializations);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error assigning category services:', error);
    }
  };

  const createInitialPricingTier = async (expertId: string, category: string) => {
    try {
      // Get base pricing for the category
      const { data: categoryData, error: categoryError } = await supabase
        .from('expert_categories')
        .select('*')
        .eq('id', category)
        .single();

      if (categoryError) throw categoryError;

      // Create initial pricing tier
      const { error } = await supabase
        .from('expert_pricing_tiers')
        .insert({
          expert_id: expertId,
          category: category,
          price_per_min_usd: categoryData.base_price_usd,
          price_per_min_inr: categoryData.base_price_inr,
          price_per_min_eur: categoryData.base_price_eur,
          consultation_fee_usd: categoryData.base_price_usd * 15,
          consultation_fee_inr: categoryData.base_price_inr * 15,
          consultation_fee_eur: categoryData.base_price_eur * 15
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error creating initial pricing tier:', error);
    }
  };

  const handleDeleteExpert = async (expertId: string) => {
    try {
      // Delete from expert_accounts table
      const { error } = await supabase
        .from('expert_accounts')
        .delete()
        .eq('id', expertId);

      if (error) throw error;

      // Update local state
      setApplications(prev => prev.filter(app => app.id !== expertId));
      
      toast.success('Expert deleted successfully');
      setDeleteConfirmation({ open: false, expertId: '', expertName: '' });
      setDeleteInput('');
      setSelectedApp(null);
    } catch (error) {
      console.error('Error deleting expert:', error);
      toast.error('Failed to delete expert');
    }
  };

  const initiateDelete = (expert: ExpertApplication) => {
    setDeleteConfirmation({
      open: true,
      expertId: expert.id,
      expertName: expert.name
    });
    setDeleteInput('');
  };

  const openDocumentModal = (documents: string[], expertName: string) => {
    setDocumentModal({
      open: true,
      documents,
      expertName
    });
  };

  const getCategoryBadgeColor = (category: string) => {
    if (!category) return 'bg-gray-100 text-gray-800';
    
    const colors = {
      'listening-volunteer': 'bg-blue-100 text-blue-800',
      'listening-expert': 'bg-green-100 text-green-800',
      'listening-coach': 'bg-purple-100 text-purple-800',
      'mindfulness-expert': 'bg-yellow-100 text-yellow-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatCategoryName = (category: string) => {
    if (!category) return 'No Category';
    
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Expert Applications</h2>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Applications</SelectItem>
              <SelectItem value="pending">Pending Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="disapproved">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchApplications} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications List */}
        <div className="space-y-4">
          {applications.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No applications found</p>
              </CardContent>
            </Card>
          ) : (
            applications.map((app) => (
              <Card 
                key={app.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedApp?.id === app.id ? 'ring-2 ring-primary' : ''
                } ${app.status === 'pending' ? 'border-l-4 border-l-yellow-500' : ''}`}
                onClick={() => setSelectedApp(app)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{app.name}</h3>
                        <Badge 
                          variant="secondary"
                          className={getCategoryBadgeColor(app.category)}
                        >
                          {formatCategoryName(app.category)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {app.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {app.city}, {app.country}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {app.bio}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        Applied: {new Date(app.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {app.status === 'pending' && (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                      {app.status === 'approved' && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approved
                        </Badge>
                      )}
                      {app.status === 'disapproved' && (
                        <Badge variant="outline" className="text-red-600 border-red-600">
                          <XCircle className="h-3 w-3 mr-1" />
                          Rejected
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Application Details */}
        <div className="sticky top-6">
          {selectedApp ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Application Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p>{selectedApp.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p>{selectedApp.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p>{selectedApp.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Experience</label>
                    <p>{selectedApp.experience} years</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Address</label>
                  <p>{selectedApp.address}, {selectedApp.city}, {selectedApp.state}, {selectedApp.country}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryBadgeColor(selectedApp.category)}>
                      {formatCategoryName(selectedApp.category)}
                    </Badge>
                    {selectedApp.status === 'pending' && (
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Change category..." />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  {selectedCategory && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                      <strong>New category:</strong> {categories.find(c => c.id === selectedCategory)?.name}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Specialization</label>
                  <p>{selectedApp.specialization}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Bio</label>
                  <p className="text-sm">{selectedApp.bio}</p>
                </div>

                {selectedApp.certificate_urls && selectedApp.certificate_urls.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Certificates</label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDocumentModal(selectedApp.certificate_urls, selectedApp.name)}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View Documents ({selectedApp.certificate_urls.length})
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {selectedApp.status === 'pending' && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApproval(selectedApp.id, 'approved')}
                        disabled={actionLoading === selectedApp.id}
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleApproval(selectedApp.id, 'disapproved')}
                        disabled={actionLoading === selectedApp.id}
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Rejection Reason (optional)
                      </label>
                      <Textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Provide a reason for rejection..."
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                {selectedApp.status !== 'pending' && (
                  <div className="pt-4 border-t">
                    <Button
                      variant="destructive"
                      onClick={() => initiateDelete(selectedApp)}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Expert
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Select an application to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ExpertDeleteConfirmationModal
        isOpen={deleteConfirmation.open}
        onClose={() => setDeleteConfirmation({ open: false, expertId: '', expertName: '' })}
        onConfirm={() => handleDeleteExpert(deleteConfirmation.expertId)}
        expertName={deleteConfirmation.expertName}
        expertId={deleteConfirmation.expertId}
      />

      {/* Document View Modal */}
      <DocumentViewModal
        isOpen={documentModal.open}
        onClose={() => setDocumentModal({ open: false, documents: [], expertName: '' })}
        documentUrls={documentModal.documents}
        expertName={documentModal.expertName}
      />
    </div>
  );
};