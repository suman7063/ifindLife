
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const SettingsEditor: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input id="siteName" defaultValue="iFind Life" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="siteUrl">Site URL</Label>
              <Input id="siteUrl" defaultValue="https://ifindlife.com" />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch id="maintenance" />
            <Label htmlFor="maintenance">Maintenance Mode</Label>
          </div>
          
          <div className="flex justify-end">
            <Button>Save Settings</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Email Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fromEmail">From Email</Label>
              <Input id="fromEmail" defaultValue="noreply@ifindlife.com" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input id="supportEmail" defaultValue="support@ifindlife.com" />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button>Save Email Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsEditor;
