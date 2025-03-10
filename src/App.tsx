
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Experts from "./pages/Experts";
import AstrologerDetail from "./pages/AstrologerDetail";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import ExpertLogin from "./pages/ExpertLogin";
import ExpertDashboard from "./pages/ExpertDashboard";
import UserLogin from "./pages/UserLogin";
import UserDashboard from "./pages/UserDashboard";
import { AuthProvider } from "./contexts/AuthContext";
import { UserAuthProvider } from "./contexts/UserAuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <UserAuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/experts" element={<Experts />} />
              <Route path="/experts/:id" element={<AstrologerDetail />} />
              <Route path="/login" element={<UserLogin />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/expert-login" element={<ExpertLogin />} />
              <Route path="/expert-dashboard" element={<ExpertDashboard />} />
              <Route path="/user-dashboard" element={<UserDashboard />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
              {/* Redirect from old route to new route */}
              <Route path="/therapists" element={<Experts />} />
              <Route path="/therapists/:id" element={<AstrologerDetail />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </UserAuthProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
