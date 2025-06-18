
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { AdminAuthProvider } from '@/contexts/admin-auth/AdminAuthProvider';
import { EnhancedUnifiedAuthProvider } from '@/contexts/auth/EnhancedUnifiedAuthContext';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AdminAuthProvider>
        <EnhancedUnifiedAuthProvider>
          <App />
        </EnhancedUnifiedAuthProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  </StrictMode>
);
