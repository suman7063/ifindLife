
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NewNavbar from './components/NewNavbar';
import Footer from './components/Footer';

// Import all pages
import Index from './pages/Index';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import Programs from './pages/Programs';
import Experts from './pages/Experts';
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import UserDashboardPages from './pages/UserDashboardPages';
import ExpertLogin from './pages/ExpertLogin';
import ExpertRegister from './pages/ExpertRegister';
import ExpertDashboard from './pages/ExpertDashboard';
import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';
import Contact from './pages/Contact';
import FAQs from './pages/FAQs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CareerGuidance from './pages/CareerGuidance';
import MentalHealthAssessment from './pages/MentalHealthAssessment';
import IssueBasedSessions from './pages/IssueBasedSessions';
import AcademicPrograms from './pages/AcademicPrograms';
import BusinessPrograms from './pages/BusinessPrograms';
import ProgramsForWellnessSeekers from './pages/ProgramsForWellnessSeekers';
import LogoutPage from './pages/LogoutPage';
import NotFound from './pages/NotFound';

const AppRoutes: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NewNavbar />
      <main className="flex-1 pt-16">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/services" element={<Services />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/experts" element={<Experts />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/user-register" element={<UserRegister />} />
          <Route path="/user-dashboard" element={<UserDashboardPages />} />
          <Route path="/user-dashboard/:section" element={<UserDashboardPages />} />
          <Route path="/expert-login" element={<ExpertLogin />} />
          <Route path="/expert-register" element={<ExpertRegister />} />
          <Route path="/expert-dashboard" element={<ExpertDashboard />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/career-guidance" element={<CareerGuidance />} />
          <Route path="/mental-health-assessment" element={<MentalHealthAssessment />} />
          <Route path="/issue-based-sessions" element={<IssueBasedSessions />} />
          <Route path="/academic-programs" element={<AcademicPrograms />} />
          <Route path="/business-programs" element={<BusinessPrograms />} />
          <Route path="/programs-for-wellness-seekers" element={<ProgramsForWellnessSeekers />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default AppRoutes;
