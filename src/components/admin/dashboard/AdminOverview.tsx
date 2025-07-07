
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminAuthClean } from '@/contexts/AdminAuthClean';
import { Users, CheckCircle, Clock, TrendingUp } from 'lucide-react';

const AdminOverview: React.FC = () => {
  const adminAuth = useAdminAuthClean();
  const currentUser = adminAuth?.admin;
  
  return (
    <div className="space-y-6 w-full">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-ifind-aqua to-ifind-teal rounded-lg p-8 text-white">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">Welcome to Admin Dashboard</h1>
          <p className="text-xl text-white/90 mb-6">
            Manage your platform with powerful admin tools and insights
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 min-w-[200px]">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8" />
                <div>
                  <p className="text-sm text-white/80">Total Experts</p>
                  <p className="text-2xl font-bold">124</p>
                </div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 min-w-[200px]">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8" />
                <div>
                  <p className="text-sm text-white/80">Approved Experts</p>
                  <p className="text-2xl font-bold">98</p>
                </div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 min-w-[200px]">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8" />
                <div>
                  <p className="text-sm text-white/80">Pending Approvals</p>
                  <p className="text-2xl font-bold">26</p>
                </div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 min-w-[200px]">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8" />
                <div>
                  <p className="text-sm text-white/80">Active Users</p>
                  <p className="text-2xl font-bold">1,247</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 w-full">
        <Card>
          <CardHeader>
            <CardTitle>Admin Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Logged in as: {currentUser?.name || currentUser?.id}</p>
            <p>Role: {currentUser?.role}</p>
            <p>Status: Clean Auth System Active</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>System Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <p>System Version: 1.0.0</p>
            <p>Last Updated: {new Date().toLocaleDateString()}</p>
            <p>Storage Used: 24%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
