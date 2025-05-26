
import React from 'react';
import NewNavbar from '@/components/NewNavbar';
import Footer from '@/components/Footer';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title = "Expert Dashboard", 
  description = "Manage your professional profile and client interactions"
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <NewNavbar />
      <main className="flex-1 container py-8 pt-28"> {/* Added top padding to prevent header overlap */}
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground mb-6">
          {description}
        </p>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
