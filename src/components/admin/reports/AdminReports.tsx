
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileSpreadsheet, FileText, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

// Sample data for demonstration
const revenueReports = [
  { id: 1, name: "Revenue by Service Type - Q1", date: "2025-01-15", format: "Excel" },
  { id: 2, name: "Monthly Revenue Summary", date: "2025-04-01", format: "PDF" },
  { id: 3, name: "Revenue by Expert - Q1", date: "2025-04-05", format: "Excel" },
  { id: 4, name: "Program Revenue Breakdown", date: "2025-04-10", format: "Excel" },
  { id: 5, name: "Yearly Comparative Analysis", date: "2025-03-20", format: "PDF" },
];

const userReports = [
  { id: 1, name: "User Acquisition Report - Q1", date: "2025-01-20", format: "Excel" },
  { id: 2, name: "User Engagement Summary", date: "2025-04-02", format: "PDF" },
  { id: 3, name: "Demographic Analysis", date: "2025-04-05", format: "PDF" },
  { id: 4, name: "User Retention Report", date: "2025-04-08", format: "Excel" },
  { id: 5, name: "Daily Active Users", date: "2025-04-01", format: "Excel" },
];

const AdminReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState("saved");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<string | null>(null);
  const [selectedReportFormat, setSelectedReportFormat] = useState<string | null>(null);
  
  const handleGenerateReport = () => {
    if (!selectedReportType || !selectedReportFormat) {
      toast.error("Please select report type and format");
      return;
    }
    
    toast.success(`Generating ${selectedReportType} report in ${selectedReportFormat} format`);
    setIsDialogOpen(false);
    
    setTimeout(() => {
      toast.success("Report generation complete!");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Reports</h2>
          <p className="text-muted-foreground">Generate and manage platform reports</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          Generate New Report
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="saved">Saved Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Reports</TabsTrigger>
          <TabsTrigger value="users">User Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="saved" className="space-y-4">
          <ReportTable 
            title="Recently Generated Reports" 
            description="Access your recently generated reports"
            reports={[...revenueReports.slice(0, 2), ...userReports.slice(0, 2)]} 
          />
        </TabsContent>
        
        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Reports that are automatically generated on a schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Next Run</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Weekly Revenue Summary</TableCell>
                      <TableCell>Weekly</TableCell>
                      <TableCell>2025-04-14</TableCell>
                      <TableCell>Excel</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Monthly User Growth</TableCell>
                      <TableCell>Monthly</TableCell>
                      <TableCell>2025-05-01</TableCell>
                      <TableCell>PDF</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue" className="space-y-4">
          <ReportTable 
            title="Revenue Reports" 
            description="Financial and revenue-related reports"
            reports={revenueReports} 
          />
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <ReportTable 
            title="User Reports" 
            description="User engagement and demographic reports"
            reports={userReports} 
          />
        </TabsContent>
      </Tabs>

      {/* Generate Report Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Generate New Report</DialogTitle>
            <DialogDescription>
              Select the type of report you want to generate
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reportType">Report Type</Label>
              <Select onValueChange={setSelectedReportType}>
                <SelectTrigger id="reportType">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue Report</SelectItem>
                  <SelectItem value="users">User Analytics</SelectItem>
                  <SelectItem value="experts">Expert Performance</SelectItem>
                  <SelectItem value="sessions">Session Analytics</SelectItem>
                  <SelectItem value="programs">Program Enrollments</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateRange">Date Range</Label>
              <div className="flex space-x-2">
                <Input id="startDate" type="date" className="w-full" />
                <span className="flex items-center">to</span>
                <Input id="endDate" type="date" className="w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="format">Format</Label>
              <Select onValueChange={setSelectedReportFormat}>
                <SelectTrigger id="format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="emailReport" />
              <Label htmlFor="emailReport">Email report when generated</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleGenerateReport}>Generate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ReportTableProps {
  title: string;
  description: string;
  reports: { id: number; name: string; date: string; format: string }[];
}

const ReportTable: React.FC<ReportTableProps> = ({ title, description, reports }) => {
  const handleDownload = (id: number) => {
    toast.success(`Downloading report ${id}`);
  };
  
  const handleSend = (id: number) => {
    toast.success(`Report ${id} has been sent to your email`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Generated Date</TableHead>
                <TableHead>Format</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium flex items-center">
                    {report.format === "Excel" ? (
                      <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
                    ) : (
                      <FileText className="h-4 w-4 mr-2 text-blue-600" />
                    )}
                    {report.name}
                  </TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>{report.format}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDownload(report.id)}
                      >
                        <Download className="h-4 w-4 mr-1" /> 
                        <span className="hidden sm:inline">Download</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleSend(report.id)}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminReports;
