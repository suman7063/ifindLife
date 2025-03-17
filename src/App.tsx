import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ExpertRegistration from './pages/ExpertRegistration';
import ExpertDashboard from './pages/ExpertDashboard';
import Home from './pages/Home';
import Experts from './pages/Experts';
import ExpertDetails from './pages/ExpertDetails';
import UserRegistration from './pages/UserRegistration';
import Login from './pages/Login';
import Contact from './pages/Contact';
import About from './pages/About';
import Services from './pages/Services';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import MigrateData from './pages/MigrateData';
import { UserAuthProvider } from '@/contexts/UserAuthContext';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <UserAuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/experts" element={<Experts />} />
          <Route path="/experts/:id" element={<ExpertDetails />} />
          <Route path="/expert-registration" element={<ExpertRegistration />} />
          <Route path="/expert-dashboard" element={<ExpertDashboard />} />
          <Route path="/user-registration" element={<UserRegistration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/migrate-data" element={<MigrateData />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </Router>
    </UserAuthProvider>
  );
}

export default App;
