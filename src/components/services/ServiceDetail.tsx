import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useDialog } from '@/hooks/useDialog';
import { Service } from '@/types/service';
import { Expert } from '@/types/expert';
import { from } from '@/lib/supabase';
import BookingDialog from '@/components/booking/BookingDialog';

interface ServiceDetailProps {
  service?: Service;
}

const ServiceDetail: React.FC<ServiceDetailProps> = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [filteredExperts, setFilteredExperts] = useState<Expert[]>([]);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const { DialogComponent, showDialog } = useDialog();

  const fetchService = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await from('services').select('*').eq('id', serviceId).single();

      if (error) {
        throw new Error(error.message);
      }

      setService(data as Service);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching service:', err);
      setError('Failed to load service. Please try again later.');
      setLoading(false);
      toast.error('Failed to load service. Please try again later.');
    }
  }, [serviceId]);

  const fetchExperts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await from('experts').select('*');

      if (error) {
        throw new Error(error.message);
      }

      setExperts(data as Expert[]);
      setFilteredExperts(data as Expert[]);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching experts:', err);
      setError('Failed to load experts. Please try again later.');
      setLoading(false);
      toast.error('Failed to load experts. Please try again later.');
    }
  }, []);

  useEffect(() => {
    fetchService();
    fetchExperts();
  }, [fetchService, fetchExperts]);

  const handleBookingClick = () => {
    if (!isAuthenticated) {
      // Store service ID for post-login action
      sessionStorage.setItem('pendingAction', 'book');
      sessionStorage.setItem('pendingServiceId', serviceId || '');
      sessionStorage.setItem('returnPath', window.location.pathname);

      toast.info("Please log in to book a service");
      navigate('/user-login');
      return;
    }

    // Show booking dialog
    setShowBookingDialog(true);
  };

  const handleBookingComplete = () => {
    toast.success("Booking completed successfully!");
    setShowBookingDialog(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-ifind-teal" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!service) {
    return <div>Service not found</div>;
  }

  return (
    <div className="container py-8 md:py-12">
      <Card className="border shadow-lg max-w-3xl mx-auto">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl font-bold">{service.name}</CardTitle>
          <CardDescription>{service.description}</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <ScrollArea className="max-h-80">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">About this Service</h3>
              <p>{service.details}</p>

              <h3 className="text-xl font-semibold">Available Experts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredExperts.map((expert) => (
                  <Card key={expert.id} className="border">
                    <CardContent className="flex flex-col items-center justify-center p-4">
                      <Avatar className="h-16 w-16 mb-2">
                        <AvatarImage src={expert.profile_picture} alt={expert.name} />
                        <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-center">{expert.name}</CardTitle>
                      <CardDescription className="text-center text-muted-foreground">
                        {expert.title}
                      </CardDescription>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => setSelectedExpert(expert)}
                      >
                        Select
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollArea>
          <div className="mt-6 flex justify-between items-center">
            <div>
              <span className="text-lg font-semibold">Price:</span> ${service.price}
            </div>
            <Button onClick={handleBookingClick} disabled={!filteredExperts.length}>
              Book Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {showBookingDialog && (
        <BookingDialog
          open={showBookingDialog}
          onOpenChange={setShowBookingDialog}
          serviceName={service.name}
          matchingExperts={filteredExperts}
          selectedExpert={selectedExpert}
          setSelectedExpert={setSelectedExpert}
          onBookingComplete={handleBookingComplete}
        />
      )}
      <DialogComponent />
    </div>
  );
};

export default ServiceDetail;
