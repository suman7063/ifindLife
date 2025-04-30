
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useAdminTools } from '@/hooks/useAdminTools';

const AdminSettings = () => {
  const { ProgramResetTool } = useAdminTools();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your admin preferences and site configuration.
        </p>
      </div>

      <Separator />

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="tools">Admin Tools</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
              <CardDescription>
                Update general information about your website.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input id="site-name" defaultValue="iFindLife" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Input id="site-description" defaultValue="Mental Health & Wellness Platform" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input id="contact-email" defaultValue="support@ifindlife.com" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                <Switch id="maintenance-mode" />
              </div>

              <Button className="mt-4">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Password Requirements</CardTitle>
              <CardDescription>
                Set minimum requirements for user passwords.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="min-length">Minimum Length</Label>
                <Input id="min-length" type="number" defaultValue="8" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="require-uppercase">Require Uppercase</Label>
                <Switch id="require-uppercase" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="require-numbers">Require Numbers</Label>
                <Switch id="require-numbers" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="require-special">Require Special Characters</Label>
                <Switch id="require-special" defaultChecked />
              </div>
              
              <Button className="mt-4">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tools" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Administration Tools</CardTitle>
              <CardDescription>
                Advanced tools for system administrators.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProgramResetTool />
              
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium mb-2">Database Utilities</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Clean Orphaned Records
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Regenerate Search Indexes
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Export Database Backup
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
