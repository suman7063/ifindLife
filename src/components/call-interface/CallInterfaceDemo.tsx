import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CallInterface, Expert } from './CallInterface';
import { Phone, Video } from 'lucide-react';

// Demo expert data
const demoExpert: Expert = {
  id: 'demo-expert-1',
  name: 'Dr. Sarah Johnson',
  imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
  pricePerMinute: 15
};

export const CallInterfaceDemo: React.FC = () => {
  const [isCallOpen, setIsCallOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Call Interface Demo</h1>
          <p className="text-xl text-muted-foreground">
            Experience our comprehensive call interface system
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>Pre-Call Selection</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-muted-foreground">
                • Call type selection (Video/Audio)
              </div>
              <div className="text-sm text-muted-foreground">
                • Duration selection (30/60 min)
              </div>
              <div className="text-sm text-muted-foreground">
                • Integrated payment processing
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Video className="h-5 w-5" />
                <span>In-Call Interface</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-muted-foreground">
                • Full video container display
              </div>
              <div className="text-sm text-muted-foreground">
                • Picture-in-picture preview
              </div>
              <div className="text-sm text-muted-foreground">
                • Time tracking with alerts
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>💬</span>
                <span>Additional Features</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-muted-foreground">
                • Side-by-side chat panel
              </div>
              <div className="text-sm text-muted-foreground">
                • Responsive layout design
              </div>
              <div className="text-sm text-muted-foreground">
                • Error handling & retry
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demo Expert Card */}
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Demo Expert</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <img 
                src={demoExpert.imageUrl} 
                alt={demoExpert.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold">{demoExpert.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Expert Consultant
                </p>
                <p className="text-sm font-medium">
                  ₹{demoExpert.pricePerMinute}/minute
                </p>
              </div>
            </div>
            
            <Button 
              onClick={() => setIsCallOpen(true)}
              className="w-full"
              size="lg"
            >
              Start Demo Call
            </Button>
          </CardContent>
        </Card>

        {/* Interface States */}
        <Card>
          <CardHeader>
            <CardTitle>Interface States</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Call Flow States:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>1. <strong>Selecting:</strong> Call type & duration selection</li>
                  <li>2. <strong>Connecting:</strong> Payment processing & connection</li>
                  <li>3. <strong>Connected:</strong> Active call interface</li>
                  <li>4. <strong>Ended:</strong> Call summary & rating</li>
                  <li>5. <strong>Error:</strong> Error handling with retry</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Key Features:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Time alerts at 3 min & 30 sec</li>
                  <li>• Progress bar visualization</li>
                  <li>• Modal-based focused experience</li>
                  <li>• Authentication protection</li>
                  <li>• Razorpay payment integration</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Integration Path</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">To see this demo:</h4>
                <code className="text-sm bg-muted p-2 rounded block">
                  Navigate to: /call-interface-demo
                </code>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">To integrate into existing system:</h4>
                <pre className="text-sm bg-muted p-4 rounded overflow-x-auto">
{`import { CallInterface } from '@/components/call-interface/CallInterface';

// Use in your component
<CallInterface
  isOpen={isCallModalOpen}
  onClose={() => setIsCallModalOpen(false)}
  expert={selectedExpert}
/>`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call Interface Modal */}
      <CallInterface
        isOpen={isCallOpen}
        onClose={() => setIsCallOpen(false)}
        expert={demoExpert}
      />
    </div>
  );
};