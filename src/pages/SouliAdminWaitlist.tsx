import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSouliAuth } from '@/contexts/SouliAuthContext';
import WaitlistViewer from '@/components/admin/waitlist/WaitlistViewer';
import { Button } from '@/components/ui/button';
import { LogOut, ArrowLeft } from 'lucide-react';

const SouliAdminWaitlist = () => {
  const { isAuthenticated, isLoading, logout } = useSouliAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/souli/auth');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/souli/auth');
  };

  const handleBackToSouli = () => {
    navigate('/souli');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToSouli}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Souli
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Souli Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Waitlist Management</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <WaitlistViewer />
      </div>
    </div>
  );
};

export default SouliAdminWaitlist;
