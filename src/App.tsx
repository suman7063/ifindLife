
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import UserDashboard from './pages/UserDashboard';
import ExpertLogin from './pages/ExpertLogin';
import ComingSoonPage from './components/user/dashboard/ComingSoonPage';
import { Toaster } from 'sonner';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserLogin />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/user-register" element={<UserRegister />} />
        <Route path="/expert-login" element={<ExpertLogin />} />

        {/* User Dashboard Routes */}
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/user-dashboard/wallet" element={<ComingSoonPage title="Wallet" description="The wallet feature is coming soon. You will be able to manage your transactions and balance." />} />
        <Route path="/user-dashboard/appointments" element={<ComingSoonPage title="Appointments" description="The appointments feature is coming soon. You will be able to schedule and manage your appointments." />} />
        <Route path="/user-dashboard/messages" element={<ComingSoonPage title="Messages" description="The messaging feature is coming soon. You will be able to chat with experts and receive notifications." />} />
        <Route path="/user-dashboard/favorites" element={<ComingSoonPage title="Favorites" description="The favorites feature is coming soon. You will be able to save and manage your favorite experts." />} />
        <Route path="/user-dashboard/referrals" element={<ComingSoonPage title="Referrals" description="The referrals feature is coming soon. You will be able to invite friends and earn rewards." />} />
        <Route path="/user-dashboard/settings" element={<ComingSoonPage title="Settings" description="The settings feature is coming soon. You will be able to manage your account preferences." />} />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
