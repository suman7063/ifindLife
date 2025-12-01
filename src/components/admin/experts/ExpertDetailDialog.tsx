import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { User, Mail, Phone, MapPin, Calendar, FileText, Image, Trash2, Check, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface ExpertCategory {
  id: string;
  name: string;
  description?: string;
  base_price_30_inr?: number;
  base_price_30_eur?: number;
  base_price_60_inr?: number;
  base_price_60_eur?: number;
  created_at?: string;
}

interface ExpertDetailDialogProps {
  expertId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

interface ExpertDetails {
  id: string;
  auth_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  specialization: string;
  experience: string;
  bio: string;
  category: string;
  status: string;
  certificate_urls: string[];
  profile_picture?: string;
  created_at: string;
}

const ExpertDetailDialog: React.FC<ExpertDetailDialogProps> = ({
  expertId,
  isOpen,
  onClose,
  onUpdate
}) => {
  const [expert, setExpert] = useState<ExpertDetails | null>(null);
  const [categories, setCategories] = useState<ExpertCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchExpertDetails = useCallback(async () => {
    if (!expertId) {
      console.error('ExpertDetailDialog: No expertId provided');
      toast.error('Expert ID is missing');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      console.log('ExpertDetailDialog: Fetching expert details for ID:', expertId, 'Type:', typeof expertId);
      
      // Use RPC function (for admin access, bypasses RLS)
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('admin_list_all_experts');
      
      if (rpcError) {
        console.error('ExpertDetailDialog: RPC error:', rpcError);
        throw rpcError;
      }
      
      if (!rpcData || rpcData.length === 0) {
        console.error('ExpertDetailDialog: No experts found in RPC response');
        throw new Error('No experts found');
      }
      
      // Find the expert by matching auth_id, id, or user_id
      const expertData = rpcData.find((e: { auth_id?: string; id?: string; user_id?: string }) => {
        const eAuthId = String(e.auth_id || '');
        const eId = String(e.id || '');
        const eUserId = String(e.user_id || '');
        const searchId = String(expertId);
        
        return eAuthId === searchId || eId === searchId || eUserId === searchId;
      });
      
      if (!expertData) {
        console.error('ExpertDetailDialog: Expert not found. Available IDs:', rpcData.map((e: { auth_id?: string; id?: string; user_id?: string }) => ({
          auth_id: e.auth_id,
          id: e.id,
          user_id: e.user_id
        })));
        throw new Error(`Expert with ID ${expertId} not found`);
      }
      
      console.log('ExpertDetailDialog: Found expert:', expertData);
      
      // Map the data to match ExpertDetails interface
      const mappedExpert: ExpertDetails = {
        id: expertData.id || expertData.auth_id || expertId,
        auth_id: expertData.auth_id || expertData.id || expertId,
        name: expertData.name || '',
        email: expertData.email || '',
        phone: expertData.phone || '',
        address: expertData.address || '',
        city: expertData.city || '',
        state: expertData.state || '',
        country: expertData.country || '',
        specialization: expertData.specialization || '',
        experience: expertData.experience || '',
        bio: expertData.bio || '',
        category: expertData.category || '',
        status: expertData.status || 'pending',
        certificate_urls: expertData.certificate_urls || [],
        profile_picture: expertData.profile_picture || undefined,
        created_at: expertData.created_at || new Date().toISOString()
      };
      
      setExpert(mappedExpert);
      setSelectedCategory(expertData.category || '');
    } catch (error) {
      console.error('ExpertDetailDialog: Error fetching expert details:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to load expert details: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [expertId]);

  useEffect(() => {
    if (expertId && isOpen) {
      fetchExpertDetails();
      fetchCategories();
    } else if (!isOpen) {
      // Reset expert data when dialog closes
      setExpert(null);
      setLoading(false);
    }
  }, [expertId, isOpen, fetchExpertDetails]);

  const fetchCategories = async () => {
    try {
      console.log('ExpertDetailDialog: Fetching categories...');
      const { data, error } = await supabase
        .from('expert_categories')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('ExpertDetailDialog: Error fetching categories:', error);
        throw error;
      }
      
      console.log('ExpertDetailDialog: Fetched categories:', data);
      
      if (!data || data.length === 0) {
        console.warn('ExpertDetailDialog: No categories found in database, using fallback');
        // Fallback to hardcoded categories if database is empty
        setCategories([
          { id: 'listening-volunteer', name: 'Listening Volunteer' },
          { id: 'listening-expert', name: 'Listening Expert' },
          { id: 'listening-coach', name: 'Listening Coach' },
          { id: 'mindfulness-expert', name: 'Mindfulness Expert' },
        ]);
      } else {
        setCategories(data);
      }
    } catch (error) {
      console.error('ExpertDetailDialog: Error fetching categories:', error);
      // Fallback categories on error
      setCategories([
        { id: 'listening-volunteer', name: 'Listening Volunteer' },
        { id: 'listening-expert', name: 'Listening Expert' },
        { id: 'listening-coach', name: 'Listening Coach' },
        { id: 'mindfulness-expert', name: 'Mindfulness Expert' },
      ]);
      toast.error('Failed to load categories from database, using default categories');
    }
  };


  const handleApprove = async () => {
    if (!expert) return;
    
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('expert_accounts')
        .update({ 
          status: 'approved',
          category: selectedCategory
        })
        .eq('auth_id', expert.auth_id);

      if (error) throw error;
      
      toast.success('Expert approved successfully');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error approving expert:', error);
      toast.error('Failed to approve expert');
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async () => {
    if (!expert) return;
    
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('expert_accounts')
        .update({ status: 'rejected' })
        .eq('auth_id', expert.auth_id);

      if (error) throw error;
      
      toast.success('Expert rejected');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error rejecting expert:', error);
      toast.error('Failed to reject expert');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!expert || !selectedCategory) return;
    
    setUpdating(true);
    try {
      // Use edge function for admin update (bypasses RLS)
      const { data: fnData, error: fnError } = await supabase.functions.invoke('admin-update-expert', {
        body: { 
          id: String(expert.auth_id), 
          category: selectedCategory 
        }
      });

      if (fnError) {
        throw fnError;
      }

      if (!fnData?.success) {
        throw new Error(fnData?.error || 'Failed to update category');
      }

      // Update local state
      setExpert({ ...expert, category: selectedCategory });
      toast.success('Category updated successfully');
      onUpdate();
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error(`Failed to update category: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!expert) return;
    
    setUpdating(true);
    try {
      // Use edge function for admin soft delete (requires service role)
      const { data: fnData, error: fnError } = await supabase.functions.invoke('admin-delete-expert', {
        body: { 
          id: String(expert.auth_id)
        }
      });

      if (fnError) {
        throw fnError;
      }

      if (!fnData?.success) {
        throw new Error(fnData?.error || 'Failed to delete expert');
      }
      
      toast.success('Expert soft deleted successfully. The expert can be restored if needed.');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error deleting expert:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to delete expert: ${errorMessage}`);
    } finally {
      setUpdating(false);
    }
  };

  const getDocumentUrl = (path: string) => {
    const { data } = supabase.storage.from('expert-certificates').getPublicUrl(path);
    return data.publicUrl;
  };

  const getProfilePictureUrl = (path: string) => {
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    return data.publicUrl;
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Expert Application Details
          </DialogTitle>
          <DialogDescription>
            View and manage expert information, documents, and category assignment.
          </DialogDescription>
        </DialogHeader>

        {loading || !expert ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading expert details...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header with Status and Profile Picture */}
            <div className="flex items-start gap-4">
              {expert.profile_picture && (
                <div className="flex-shrink-0">
                  <img
                    src={getProfilePictureUrl(expert.profile_picture)}
                    alt={expert.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">{expert.name}</h2>
                  <Badge variant={expert.status === 'pending' ? 'secondary' : expert.status === 'approved' ? 'default' : 'destructive'}>
                    {expert.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{expert.specialization}</p>
                <p className="text-sm text-muted-foreground">Applied on {new Date(expert.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <Separator />

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{expert.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{expert.phone}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <span>{expert.address}, {expert.city}, {expert.state}, {expert.country}</span>
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="font-medium">Experience</Label>
                    <p>{expert.experience} years</p>
                  </div>
                  <div>
                    <Label className="font-medium">Current Category</Label>
                    <p className="capitalize">{expert.category ? expert.category.replace(/-/g, ' ') : 'Not assigned'}</p>
                  </div>
                </div>
                <div>
                  <Label className="font-medium">Bio</Label>
                  <p className="mt-1 text-sm leading-relaxed">{expert.bio}</p>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Uploaded Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                {expert.certificate_urls && expert.certificate_urls.length > 0 ? (
                  <div className="space-y-2">
                    {expert.certificate_urls.map((url, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                        <FileText className="h-4 w-4" />
                        <span className="flex-1">Certificate {index + 1}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(getDocumentUrl(url), '_blank')}
                        >
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No documents uploaded</p>
                )}
              </CardContent>
            </Card>

            {/* Category Management - Available for all experts */}
            <Card>
              <CardHeader>
                <CardTitle>Category Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="font-medium">Assign Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={categories.length > 0 ? "Select category" : "Loading categories..."} />
                    </SelectTrigger>
                    <SelectContent 
                      className="z-[9999]" 
                      position="popper"
                      sideOffset={4}
                    >
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-categories" disabled>No categories available</SelectItem>
                  )}
                    </SelectContent>
                  </Select>
                </div>
                {selectedCategory !== expert.category && (
                  <Button
                    onClick={handleUpdateCategory}
                    disabled={updating || !selectedCategory}
                    className="w-full"
                  >
                    {updating ? 'Updating...' : 'Update Category'}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={updating}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Expert
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will soft delete the expert account. The expert will be hidden from the system
                      but can be restored later if needed. Their data will be preserved.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
{/* 
              {expert.status === 'pending' && (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleReject} disabled={updating}>
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button onClick={handleApprove} disabled={updating}>
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </div>
              )} */}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExpertDetailDialog;