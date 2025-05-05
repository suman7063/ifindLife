
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AdminUsersManager: React.FC = () => {
  const [users] = useState([
    { id: 1, username: 'admin', role: 'admin' },
    { id: 2, username: 'moderator', role: 'moderator' }
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Users</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button variant="outline">Add New Admin</Button>
          </div>
          
          <div className="border rounded-md">
            <table className="w-full">
              <thead>
                <tr className="bg-muted">
                  <th className="p-2 text-left">Username</th>
                  <th className="p-2 text-left">Role</th>
                  <th className="p-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-t">
                    <td className="p-2">{user.username}</td>
                    <td className="p-2">{user.role}</td>
                    <td className="p-2 text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminUsersManager;
