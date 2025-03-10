
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useExpertAuth } from './hooks/useExpertAuth';
import UserReportModal from './UserReportModal';

const UserReports: React.FC<{ users: Array<{id: string, name: string}> }> = ({ users }) => {
  const { expert, reportUser } = useExpertAuth();

  if (!expert) return null;

  const reportedUsers = expert.reportedUsers || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Reports</CardTitle>
        <CardDescription>
          Report and manage user-related issues
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Report a User</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {users.slice(0, 6).map(user => (
              <div key={user.id} className="border rounded-lg p-3 flex justify-between items-center">
                <span>{user.name}</span>
                <UserReportModal user={user} onReport={reportUser} />
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Your Reports</h3>
          {reportedUsers.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportedUsers.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.userName}</TableCell>
                      <TableCell>{report.reason}</TableCell>
                      <TableCell>{format(new Date(report.date), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            report.status === 'resolved'
                              ? 'default'
                              : report.status === 'reviewed'
                              ? 'outline'
                              : 'secondary'
                          }
                        >
                          {report.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              You haven't reported any users yet.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserReports;
