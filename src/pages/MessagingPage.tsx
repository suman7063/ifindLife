import React from 'react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import MessagingInterface from '@/components/messaging/MessagingInterface';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const MessagingPage: React.FC = () => {
  const { isAuthenticated } = useSimpleAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const expertId = searchParams.get('expert');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
            <p className="text-muted-foreground mb-4">
              Please sign in to access your messages and chat with experts.
            </p>
            <Button onClick={() => navigate('/user-login')}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleStartCall = (expertId: string, type: 'audio' | 'video') => {
    // This would integrate with the call system
    console.log(`Starting ${type} call with expert:`, expertId);
    // You could navigate to a call page or open a modal
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Messages</h1>
              <p className="text-muted-foreground">
                Chat with experts and get instant support
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <MessagingInterface 
          onStartCall={handleStartCall} 
          initialExpertId={expertId || undefined}
        />
      </div>
    </div>
  );
};

export default MessagingPage;