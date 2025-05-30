
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Flag, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const ReportPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Report User</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Flag className="h-5 w-5 mr-2" />
            Report Inappropriate Behavior
          </CardTitle>
          <CardDescription>
            Help us maintain a safe environment by reporting users who violate our community guidelines
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">User to Report</label>
            <Input placeholder="Enter username or email" />
          </div>
          
          <div>
            <label className="text-sm font-medium">Reason for Report</label>
            <select className="w-full p-2 border rounded-md">
              <option value="">Select a reason</option>
              <option value="harassment">Harassment or Bullying</option>
              <option value="inappropriate">Inappropriate Content</option>
              <option value="spam">Spam or Unwanted Messages</option>
              <option value="safety">Safety Concerns</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Additional Details</label>
            <Textarea 
              placeholder="Please provide additional context about the incident..."
              rows={4}
            />
          </div>
          
          <Button className="w-full">
            <AlertCircle className="h-4 w-4 mr-2" />
            Submit Report
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Safety Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• All reports are reviewed by our safety team within 24 hours</p>
            <p>• False reports may result in account restrictions</p>
            <p>• For urgent safety concerns, contact our emergency support line</p>
            <p>• Your identity will be kept confidential during the review process</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportPage;
