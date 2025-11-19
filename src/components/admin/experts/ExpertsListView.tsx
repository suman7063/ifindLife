import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Clock, Edit, Eye, RefreshCw, AlertCircle } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdminExpert {
  id: string;
  auth_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  specialization: string | null;
  experience: string | null;
  profile_picture: string | null;
  average_rating: number | null;
  reviews_count: number | null;
  status: string | null;
  verified: boolean | null;
  category: string | null;
  languages: string[] | null;
  city: string | null;
  country: string | null;
  created_at: string | null;
}

interface ExpertsListViewProps {
  onEditExpert?: (expert: AdminExpert) => void;
  onViewDetails?: (expert: AdminExpert) => void;
}

const ExpertsListView: React.FC<ExpertsListViewProps> = ({
  onEditExpert,
  onViewDetails
}) => {
  const [experts, setExperts] = useState<AdminExpert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch experts from expert_accounts table
  const fetchExperts = async () => {
    try {
      setLoading(true);
      setError(null);
          
      
      const { data, error } = await supabase
        .rpc('admin_list_approved_experts');
      
      if (error) {
        console.error('ExpertsListView: Error fetching experts:', error);
        throw error;
      }
      
      setExperts(data as AdminExpert[] || []);
      
    } catch (error) {
      console.error('ExpertsListView: Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to load experts');
      toast.error('Failed to load experts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Loading Experts...</span>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-ifind-teal"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Error Loading Experts</span>
            <Button onClick={fetchExperts} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Approved Experts ({experts.length})</span>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{experts.length} Active</Badge>
            <Button onClick={fetchExperts} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {experts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No approved experts found
          </div>
        ) : (
          <div className="space-y-4">
            {experts.map((expert) => (
              <div key={expert.auth_id || `expert-${expert.email}`} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={expert.profile_picture || undefined} alt={expert.name} />
                    <AvatarFallback>{expert.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg truncate">{expert.name}</h3>
                      {expert.verified && <Badge variant="default" className="bg-green-500">Verified</Badge>}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{expert.average_rating?.toFixed(1) || 'N/A'}</span>
                        <span>({expert.reviews_count || 0} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{expert.experience || 'N/A'} exp.</span>
                      </div>
                      <div className="text-xs">
                        <span>{expert.email}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {expert.specialization && (
                        <Badge variant="outline" className="text-xs">
                          {expert.specialization}
                        </Badge>
                      )}
                      {expert.category && (
                        <Badge variant="outline" className="text-xs">
                          {expert.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {expert.city && expert.country ? `${expert.city}, ${expert.country}` : 
                       expert.country || expert.city || 'Location N/A'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Joined: {expert.created_at ? new Date(expert.created_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  {onViewDetails && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onViewDetails(expert)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {onEditExpert && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEditExpert(expert)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpertsListView;