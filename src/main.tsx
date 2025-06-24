
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { UnifiedAuthProvider } from "@/contexts/auth/UnifiedAuthContext";

console.log('🔒 main.tsx loading with unified auth');

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <BrowserRouter>
      <UnifiedAuthProvider>
        <App />
      </UnifiedAuthProvider>
    </BrowserRouter>
  </StrictMode>
);
