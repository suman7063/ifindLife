import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (expertId && isOpen) {
      fetchExpertDetails();
      fetchCategories();
    }
  }, [expertId, isOpen]);

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
    }
  };

  const fetchExpertDetails = async () => {
    if (!expertId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', expertId)
        .single();

      if (error) throw error;
      setExpert(data);
      setSelectedCategory(data.category);
    } catch (error) {
      console.error('Error fetching expert details:', error);
      toast.error('Failed to load expert details');
    } finally {
      setLoading(false);
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
        .update({ status: 'disapproved' })
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

  const handleDelete = async () => {
    if (!expert) return;
    
    setUpdating(true);
    try {
      // Delete from auth users first
      const { error: authError } = await supabase.auth.admin.deleteUser(expert.auth_id);
      if (authError) console.warn('Auth user deletion failed:', authError);

      // Delete expert account
      const { error } = await supabase
        .from('expert_accounts')
        .delete()
        .eq('auth_id', expert.auth_id);

      if (error) throw error;
      
      toast.success('Expert deleted successfully');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error deleting expert:', error);
      toast.error('Failed to delete expert');
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

  if (!isOpen || !expert) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Expert Application Details
          </DialogTitle>
        </DialogHeader>

        {loading ? (
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
                    <p className="capitalize">{expert.category.replace('-', ' ')}</p>
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

            {/* Category Change (if pending) */}
            {expert.status === 'pending' && (
              <Card>
                <CardHeader>
                  <CardTitle>Review & Approval</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="font-medium">Assign Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between">
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
                      This action cannot be undone. This will permanently delete the expert account
                      and remove all their data from our servers.
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
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExpertDetailDialog;