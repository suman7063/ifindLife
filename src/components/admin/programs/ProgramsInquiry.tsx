import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { Loader2, Mail, Phone, Building2, User, Calendar, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  designation: string;
  organization_type: string | null;
  team_size: string | null;
  requirements: string | null;
  type: 'business' | 'academic';
  status: string;
  created_at: string;
  updated_at: string;
}

const ProgramsInquiry: React.FC = () => {
  const [academicLeads, setAcademicLeads] = useState<Lead[]>([]);
  const [businessLeads, setBusinessLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'academic' | 'business'>('academic');

  const fetchLeads = async () => {
    try {
      setLoading(true);
      
      // Fetch academic leads
      const { data: academicData, error: academicError } = await supabase
        .from('leads' as any)
        .select('*')
        .eq('type', 'academic')
        .order('created_at', { ascending: false });

      if (academicError) {
        console.error('Error fetching academic leads:', academicError);
        toast.error('Failed to load academic inquiries');
      } else {
        setAcademicLeads(academicData || []);
      }

      // Fetch business leads
      const { data: businessData, error: businessError } = await supabase
        .from('leads' as any)
        .select('*')
        .eq('type', 'business')
        .order('created_at', { ascending: false });

      if (businessError) {
        console.error('Error fetching business leads:', businessError);
        toast.error('Failed to load business inquiries');
      } else {
        setBusinessLeads(businessData || []);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateLeadStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('leads' as any)
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      if (activeTab === 'academic') {
        setAcademicLeads(prev =>
          prev.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead)
        );
      } else {
        setBusinessLeads(prev =>
          prev.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead)
        );
      }

      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Error updating lead status:', error);
      toast.error('Failed to update status');
    }
  };

  const renderCards = (leads: Lead[]) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-ifind-teal" />
        </div>
      );
    }

    if (leads.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No {activeTab} inquiries yet.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {leads.map((lead) => (
          <Card key={lead.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{lead.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(lead.created_at), 'MMM d, yyyy HH:mm')}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  lead.status === 'new' 
                    ? 'bg-blue-100 text-blue-800' 
                    : lead.status === 'contacted'
                    ? 'bg-yellow-100 text-yellow-800'
                    : lead.status === 'qualified'
                    ? 'bg-green-100 text-green-800'
                    : lead.status === 'converted'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {lead.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a 
                    href={`mailto:${lead.email}`} 
                    className="text-blue-600 hover:underline truncate"
                  >
                    {lead.email}
                  </a>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <a 
                    href={`tel:${lead.phone}`} 
                    className="text-blue-600 hover:underline"
                  >
                    {lead.phone}
                  </a>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{lead.organization}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{lead.designation}</span>
                </div>
              </div>

              <div className="pt-2 border-t space-y-2">
                <div className="text-sm">
                  <span className="font-medium text-gray-600">
                    {activeTab === 'academic' ? 'Institution Type:' : 'Industry Type:'}
                  </span>
                  <span className="ml-2 text-gray-700">{lead.organization_type || '-'}</span>
                </div>
                
                <div className="text-sm">
                  <span className="font-medium text-gray-600">
                    {activeTab === 'academic' ? 'Student Population:' : 'Team Size:'}
                  </span>
                  <span className="ml-2 text-gray-700">{lead.team_size || '-'}</span>
                </div>
                
                {lead.requirements && (
                  <div className="text-sm">
                    <span className="font-medium text-gray-600 flex items-start gap-1">
                      <FileText className="h-4 w-4 mt-0.5" />
                      Requirements:
                    </span>
                    <p className="ml-5 text-gray-700 mt-1 line-clamp-2">{lead.requirements}</p>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t">
                <Select
                  value={lead.status}
                  onValueChange={(value) => updateLeadStatus(lead.id, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Update status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Programs Inquiry</h2>
        <Button 
          variant="outline" 
          onClick={fetchLeads}
          className="flex items-center gap-2"
        >
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'academic' | 'business')} className="w-full">
        <div className="flex justify-left mb-6">
          <TabsList className="inline-flex w-auto justify-left">
            <TabsTrigger value="academic" className="px-6">
              Academic ({academicLeads.length})
            </TabsTrigger>
            <TabsTrigger value="business" className="px-6">
              Business ({businessLeads.length})
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="academic">
          {renderCards(academicLeads)}
        </TabsContent>
        
        <TabsContent value="business">
          {renderCards(businessLeads)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgramsInquiry;

