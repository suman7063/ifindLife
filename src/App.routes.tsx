
import { lazy } from 'react';
import NotFound from './pages/NotFound'; // Import NotFound directly to avoid lazy loading issues

// Define route types without extending RouteObject from react-router-dom
export interface AppRoute {
  path: string;
  element: JSX.Element;
  requiredRole?: 'user' | 'admin' | 'expert';
}

// Pages - pre-import critical pages to avoid dynamic import issues
const Login = lazy(() => import('./pages/Login'));
// ExpertLogin is directly imported in AppRoutes.tsx
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const MentalHealthAssessment = lazy(() => import('./pages/MentalHealthAssessment'));
const Experts = lazy(() => import('./pages/Experts'));
const ExpertDetail = lazy(() => import('./pages/ExpertDetail'));
const ProgramsForWellnessSeekers = lazy(() => import('./pages/ProgramsForWellnessSeekers'));
const ProgramsForAcademicInstitutes = lazy(() => import('./pages/ProgramsForAcademicInstitutes'));
const ProgramsForBusiness = lazy(() => import('./pages/ProgramsForBusiness'));
const ProgramDetail = lazy(() => import('./pages/ProgramDetail'));
// AboutUs is imported and defined directly in AppRoutes.tsx only
const CareerGuidance = lazy(() => import('./pages/CareerGuidance'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetailPage = lazy(() => import('./pages/service/ServiceDetailPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQs = lazy(() => import('./pages/FAQs'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const ExpertDashboard = lazy(() => import('./pages/ExpertDashboard'));
const Admin = lazy(() => import('./pages/Admin'));
const Referral = lazy(() => import('./pages/Referral'));
const UserWallet = lazy(() => import('./pages/UserWallet'));

export const routes: AppRoute[] = [
  // Main navigation routes 
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/user-login',
    element: <Login />  // Alias for /login for backward compatibility
  },
  // ExpertLogin is directly imported in AppRoutes.tsx, not included here to avoid circular dependencies
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/reset-password',
    element: <ResetPassword />
  },
  {
    path: '/mental-health-assessment',
    element: <MentalHealthAssessment />
  },
  {
    path: '/experts',
    element: <Experts />
  },
  {
    path: '/experts/:id',
    element: <ExpertDetail />
  },
  {
    path: '/programs-for-wellness-seekers',
    element: <ProgramsForWellnessSeekers />
  },
  {
    path: '/programs-for-academic-institutes',
    element: <ProgramsForAcademicInstitutes />
  },
  {
    path: '/programs-for-business',
    element: <ProgramsForBusiness />
  },
  {
    path: '/program/:id',
    element: <ProgramDetail />
  },
  // AboutUs route is completely removed from here as it's directly defined in AppRoutes.tsx
  {
    path: '/career-guidance',
    element: <CareerGuidance />
  },
  {
    path: '/blog',
    element: <Blog />
  },
  {
    path: '/blog/:slug',
    element: <BlogPost />
  },
  {
    path: '/services',
    element: <Services />
  },
  {
    path: '/services/:serviceId',
    element: <ServiceDetailPage />
  },
  {
    path: '/privacy',
    element: <PrivacyPolicy />
  },
  {
    path: '/terms',
    element: <TermsOfService />
  },
  {
    path: '/contact',
    element: <Contact />
  },
  {
    path: '/faqs',
    element: <FAQs />
  },
  {
    path: '/referral',
    element: <Referral />
  },
  
  // Protected routes with role requirements
  {
    path: '/user-dashboard/*',
    element: <UserDashboard />,
    requiredRole: 'user'
  },
  {
    path: '/expert-dashboard/*',
    element: <ExpertDashboard />,
    requiredRole: 'expert'
  },
  {
    path: '/admin/*',
    element: <Admin />,
    requiredRole: 'admin'
  },
  {
    path: "/user-dashboard/wallet",
    element: <UserWallet />,
    requiredRole: "user"
  }
];
