
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ReportUI } from '@/types/supabase/moderation';
import ReportDetailsDialog from './ReportDetailsDialog';
import ActionDialog from './ActionDialog';
import { Loader2, AlertTriangle, CheckCircle, XCircle, MoreHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReportsListProps {
  reports: ReportUI[];
  isLoading: boolean;
  onReview: (reportId: string) => void;
  onDismiss: (reportId: string) => void;
  onAction: (reportId: string, actionType: string, message: string, notes?: string) => void;
}

const ReportsList: React.FC<ReportsListProps> = ({
  reports,
  isLoading,
  onReview,
  onDismiss,
  onAction,
}) => {
  const [selectedReport, setSelectedReport] = useState<ReportUI | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isActionOpen, setIsActionOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Filter reports
  const filteredReports = reports.filter(report => {
    // Search filter
    const searchMatches = 
      report.reporterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.details.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const statusMatches = statusFilter === 'all' || report.status === statusFilter;
    
    // Type filter
    const typeMatches = 
      typeFilter === 'all' || 
      (typeFilter === 'user-reported' && report.reporterType === 'user') ||
      (typeFilter === 'expert-reported' && report.reporterType === 'expert');
    
    return searchMatches && statusMatches && typeMatches;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600">Pending</Badge>;
      case 'under_review':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600">Under Review</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-50 text-green-600">Resolved</Badge>;
      case 'dismissed':
        return <Badge variant="outline" className="bg-gray-50 text-gray-600">Dismissed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search reports..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="dismissed">Dismissed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reports</SelectItem>
            <SelectItem value="user-reported">User Reported</SelectItem>
            <SelectItem value="expert-reported">Expert Reported</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          No reports found matching your filters.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Reporter</TableHead>
                <TableHead>Against</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    {format(new Date(report.date), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{report.reporterName}</span>
                    <br />
                    <span className="text-xs text-muted-foreground capitalize">
                      {report.reporterType}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{report.targetName}</span>
                    <br />
                    <span className="text-xs text-muted-foreground capitalize">
                      {report.targetType}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    <span className="capitalize">{report.reason.replace(/_/g, ' ')}</span>
                  </TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedReport(report);
                          setIsDetailsOpen(true);
                        }}
                      >
                        <MoreHorizontal className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                      {report.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onReview(report.id)}
                        >
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                      )}
                      {report.status !== 'resolved' && report.status !== 'dismissed' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedReport(report);
                              setIsActionOpen(true);
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Action
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDismiss(report.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Dismiss
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {selectedReport && (
        <>
          <ReportDetailsDialog
            report={selectedReport}
            open={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
          />
          <ActionDialog
            report={selectedReport}
            open={isActionOpen}
            onOpenChange={setIsActionOpen}
            onAction={onAction}
          />
        </>
      )}
    </div>
  );
};

export default ReportsList;
