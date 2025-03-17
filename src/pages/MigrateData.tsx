
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { runMigrations } from '@/utils/migrateToSupabase';

const MigrateData = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [migrationComplete, setMigrationComplete] = useState(false);

  const handleMigration = async () => {
    try {
      setIsMigrating(true);
      setProgress(10);

      // Simulate progress steps
      setTimeout(() => setProgress(30), 500);
      setTimeout(() => setProgress(50), 1000);
      
      await runMigrations();
      
      setTimeout(() => setProgress(80), 1500);
      setTimeout(() => {
        setProgress(100);
        setMigrationComplete(true);
        setIsMigrating(false);
      }, 2000);
    } catch (error) {
      console.error('Migration error:', error);
      setIsMigrating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-16 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Migrate to Supabase</CardTitle>
            <CardDescription>
              Transfer your existing data from localStorage to Supabase database for improved security and reliability.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This process will migrate all your experts, users, services, and related data to your Supabase database.
              Your existing data will remain in localStorage as a backup.
            </p>
            
            {isMigrating && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-xs text-center text-muted-foreground">
                  Migration in progress... {progress}%
                </p>
              </div>
            )}
            
            {migrationComplete && (
              <div className="p-4 bg-green-100 text-green-800 rounded-md text-sm">
                Migration completed successfully! Your data is now stored in Supabase.
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleMigration} 
              disabled={isMigrating || migrationComplete}
              className="w-full"
            >
              {isMigrating ? 'Migrating...' : migrationComplete ? 'Migration Complete' : 'Start Migration'}
            </Button>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default MigrateData;
