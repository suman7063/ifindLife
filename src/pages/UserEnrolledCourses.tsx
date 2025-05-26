
import React from 'react';
import NewNavbar from '@/components/NewNavbar';
import Footer from '@/components/Footer';
import { useUserAuth } from '@/hooks/user-auth/useUserAuth';

const UserEnrolledCourses: React.FC = () => {
  const { currentUser, isAuthenticated } = useUserAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <NewNavbar />
      <main className="flex-1 container py-12">
        <h1 className="text-3xl font-bold mb-6">Your Enrolled Courses</h1>
        
        {!isAuthenticated ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Please login to view your enrolled courses.</p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-center text-gray-600">You haven't enrolled in any courses yet.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default UserEnrolledCourses;
