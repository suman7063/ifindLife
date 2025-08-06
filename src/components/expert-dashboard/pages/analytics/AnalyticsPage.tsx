
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Calendar, Download, Filter, TrendingUp, FileText, FileSpreadsheet } from 'lucide-react';
import { exportToPDF, exportToExcel, generateAnalyticsExportData } from '@/utils/exportUtils';
import { toast } from 'sonner';
import RevenueAnalytics from './RevenueAnalytics';
import ClientAnalytics from './ClientAnalytics';
import PerformanceAnalytics from './PerformanceAnalytics';
import SessionAnalytics from './SessionAnalytics';

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30days');

  const handleExport = (format: 'pdf' | 'excel') => {
    const data = generateAnalyticsExportData(timeRange);
    
    if (format === 'pdf') {
      exportToPDF(data);
      toast.success('Analytics PDF downloaded successfully!');
    } else {
      exportToExcel(data);
      toast.success('Analytics Excel downloaded successfully!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your practice performance
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 Days</SelectItem>
              <SelectItem value="30days">30 Days</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                <FileText className="h-4 w-4 mr-2" />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Download Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="text-center py-12">
            <TrendingUp className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
            <h2 className="text-2xl font-bold mb-4">No Analytics Data Available</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Start conducting sessions to see detailed analytics about your practice performance.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="revenue">
          <RevenueAnalytics timeRange={timeRange} detailed />
        </TabsContent>

        <TabsContent value="clients">
          <ClientAnalytics timeRange={timeRange} />
        </TabsContent>

        <TabsContent value="sessions">
          <SessionAnalytics timeRange={timeRange} detailed />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceAnalytics timeRange={timeRange} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;
