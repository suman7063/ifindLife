
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SessionsGrid from './SessionsGrid';
import SessionFormDialog from './SessionFormDialog';
import { useSessionsManager } from './useSessionsManager';

const SessionsEditor: React.FC = () => {
  const {
    sessions,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    selectedSession,
    handleOpenDialog,
    handleSaveSession,
    handleDeleteSession
  } = useSessionsManager();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Issue-Based Sessions Manager</h2>
          <p className="text-muted-foreground">Manage all issue-based sessions displayed on the homepage</p>
        </div>
        <Button 
          onClick={() => handleOpenDialog()} 
          className="bg-ifind-aqua hover:bg-ifind-teal"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Session
        </Button>
      </div>

      <SessionsGrid 
        sessions={sessions}
        isLoading={isLoading}
        onOpenDialog={handleOpenDialog}
        onDeleteSession={handleDeleteSession}
      />

      {/* Session Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedSession ? 'Edit Session' : 'Add New Session'}</DialogTitle>
          </DialogHeader>
          <SessionFormDialog 
            session={selectedSession || undefined}
            onSave={handleSaveSession}
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SessionsEditor;
// Also export as named export to maintain compatibility with existing imports
export { SessionsEditor };
