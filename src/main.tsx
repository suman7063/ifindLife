
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { EnhancedUnifiedAuthProvider } from "@/contexts/auth/EnhancedUnifiedAuthContext";

// DEBUG: Check if main.tsx is loading
console.log('🔒 main.tsx loading');

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

// DEBUG: Check DOM structure
console.log('🔒 Root element found:', rootElement);

root.render(
  <StrictMode>
    <BrowserRouter>
      <EnhancedUnifiedAuthProvider>
        <div style={{ minHeight: '100vh', width: '100%' }}>
          <App />
        </div>
      </EnhancedUnifiedAuthProvider>
    </BrowserRouter>
  </StrictMode>
);

// DEBUG: Additional DOM check after render
setTimeout(() => {
  console.log('🔒 Post-render DOM check');
  const navbar = document.querySelector('[data-navbar="main"]');
  console.log('🔒 Navbar element exists:', !!navbar);
  if (navbar) {
    console.log('🔒 Navbar element details:', {
      tagName: navbar.tagName,
      className: navbar.className,
      offsetHeight: navbar.offsetHeight,
      offsetWidth: navbar.offsetWidth,
      visible: navbar.offsetHeight > 0 && navbar.offsetWidth > 0
    });
  }
}, 500);
