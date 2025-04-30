
import { lazy } from 'react';

// Define route types without extending RouteObject from react-router-dom
export interface AppRoute {
  path: string;
  element: JSX.Element;
  requiredRole?: 'user' | 'admin' | 'expert';
}

// Pages - pre-import critical pages to avoid dynamic import issues
const Login = lazy(() => import('./pages/Login'));
const ExpertLogin = lazy(() => import('./pages/ExpertLogin'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const MentalHealthAssessment = lazy(() => import('./pages/MentalHealthAssessment'));
const Experts = lazy(() => import('./pages/Experts'));
const ExpertDetail = lazy(() => import('./pages/ExpertDetail'));
const ProgramsForWellnessSeekers = lazy(() => import('./pages/ProgramsForWellnessSeekers'));
const ProgramsForAcademicInstitutes = lazy(() => import('./pages/ProgramsForAcademicInstitutes'));
const ProgramsForBusiness = lazy(() => import('./pages/ProgramsForBusiness'));
const ProgramDetail = lazy(() => import('./pages/ProgramDetail'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
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

export const routes: AppRoute[] = [
  // Main navigation routes 
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/expert-login',
    element: <ExpertLogin />
  },
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
  {
    path: '/about',
    element: <AboutUs />
  },
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
  }
];
