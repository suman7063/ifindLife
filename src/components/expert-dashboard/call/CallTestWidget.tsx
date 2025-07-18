import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Phone, Video, TestTube } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { toast } from 'sonner';

const CallTestWidget: React.FC = () => {
  const { expert } = useSimpleAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [testUserName, setTestUserName] = useState('Test User');
  const [callType, setCallType] = useState<'audio' | 'video'>('video');

  const createTestCall = async () => {
    if (!expert?.id) {
      toast.error('Expert ID not found');
      return;
    }

    try {
      setIsCreating(true);
      console.log('🧪 Creating test call request...');

      const { data, error } = await supabase.functions.invoke('create-test-call-request', {
        body: {
          expert_id: expert.id,
          call_type: callType,
          user_name: testUserName
        }
      });

      if (error) {
        throw error;
      }

      console.log('✅ Test call created:', data);
      toast.success(`Test ${callType} call created! Check for incoming call notification.`);
    } catch (error) {
      console.error('❌ Error creating test call:', error);
      toast.error('Failed to create test call: ' + (error as Error).message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TestTube className="w-5 h-5" />
          <span>Test Call System</span>
          <Badge variant="outline">Dev Tool</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="testUserName">Test User Name</Label>
          <Input
            id="testUserName"
            value={testUserName}
            onChange={(e) => setTestUserName(e.target.value)}
            placeholder="Enter test user name"
          />
        </div>

        <div className="space-y-2">
          <Label>Call Type</Label>
          <Select value={callType} onValueChange={(value: 'audio' | 'video') => setCallType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="audio">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Audio Call</span>
                </div>
              </SelectItem>
              <SelectItem value="video">
                <div className="flex items-center space-x-2">
                  <Video className="w-4 h-4" />
                  <span>Video Call</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={createTestCall} 
          disabled={isCreating || !expert?.id}
          className="w-full"
        >
          {isCreating ? (
            <>
              <TestTube className="w-4 h-4 mr-2 animate-spin" />
              Creating Test Call...
            </>
          ) : (
            <>
              <TestTube className="w-4 h-4 mr-2" />
              Create Test {callType === 'video' ? 'Video' : 'Audio'} Call
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground">
          This will create a test incoming call request that you can use to test the call reception system.
        </div>
      </CardContent>
    </Card>
  );
};

export default CallTestWidget;