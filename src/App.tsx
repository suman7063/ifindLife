import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import Login from "./pages/Login";
import UserLogin from "./pages/UserLogin";
import ExpertLogin from "./pages/ExpertLogin";
import UserDashboard from "./pages/UserDashboard";
import ExpertDashboard from "./pages/ExpertDashboard";
import Experts from "./pages/Experts";
import AstrologerDetail from "./pages/AstrologerDetail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import MigrateData from "./pages/MigrateData";
import NotFound from "./pages/NotFound";
import ProtectedRoute from './components/ProtectedRoute';
import UserReferrals from './pages/UserReferrals';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/admin-login",
    element: <AdminLogin />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/user-login",
    element: <UserLogin />,
  },
  {
    path: "/expert-login",
    element: <ExpertLogin />,
  },
  {
    path: "/user-dashboard",
    element: <ProtectedRoute><UserDashboard /></ProtectedRoute>,
  },
  {
    path: "/expert-dashboard",
    element: <ProtectedRoute><ExpertDashboard /></ProtectedRoute>,
  },
  {
    path: "/experts",
    element: <Experts />,
  },
  {
    path: "/experts/:id",
    element: <AstrologerDetail />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/migrate-data",
    element: <MigrateData />,
  },
  {
    path: "/referrals",
    element: <ProtectedRoute><UserReferrals /></ProtectedRoute>,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
