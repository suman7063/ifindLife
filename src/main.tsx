
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

// DEBUG: Check if main.tsx is loading
console.log('🔒 main.tsx loading with enhanced debugging');

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
      <div style={{ minHeight: '100vh', width: '100%' }}>
        <App />
      </div>
    </BrowserRouter>
  </StrictMode>
);

// DEBUG: Enhanced DOM check after render with comprehensive logging
setTimeout(() => {
  console.log('🔒 Post-render DOM check - Comprehensive');
  
  // Check for React app structure
  const rootChildren = document.getElementById('root')?.children;
  console.log('🔒 Root children count:', rootChildren?.length || 0);
  
  // Check for main app structure
  const appElement = document.querySelector('.app');
  console.log('🔒 App element exists:', !!appElement);
  
  // Check for navbar specifically
  const navbar = document.querySelector('[data-navbar="main"]');
  console.log('🔒 Navbar element exists:', !!navbar);
  
  if (navbar) {
    const htmlNavbar = navbar as HTMLElement;
    const computedStyles = window.getComputedStyle(htmlNavbar);
    console.log('🔒 Navbar element details:', {
      tagName: navbar.tagName,
      className: navbar.className,
      offsetHeight: htmlNavbar.offsetHeight,
      offsetWidth: htmlNavbar.offsetWidth,
      visible: htmlNavbar.offsetHeight > 0 && htmlNavbar.offsetWidth > 0,
      display: computedStyles.display,
      visibility: computedStyles.visibility,
      opacity: computedStyles.opacity,
      position: computedStyles.position,
      zIndex: computedStyles.zIndex
    });
  } else {
    // Look for any nav elements
    const allNavs = document.querySelectorAll('nav');
    console.log('🔒 All nav elements found:', allNavs.length);
    allNavs.forEach((nav, index) => {
      console.log(`🔒 Nav ${index}:`, {
        className: nav.className,
        id: nav.id,
        dataAttrs: Array.from(nav.attributes).filter(attr => attr.name.startsWith('data-'))
      });
    });
  }
  
  // Check for home page elements
  const homePage = document.querySelector('.home-page');
  console.log('🔒 Home page element exists:', !!homePage);
  
  // Check general DOM health
  console.log('🔒 General DOM health:', {
    bodyChildren: document.body.children.length,
    totalElements: document.querySelectorAll('*').length,
    hasStylesheets: document.querySelectorAll('link[rel="stylesheet"]').length,
    hasScripts: document.querySelectorAll('script').length
  });
}, 500);

// Additional check after a longer delay to catch async rendering
setTimeout(() => {
  console.log('🔒 Extended DOM check after 2 seconds');
  const navbar = document.querySelector('[data-navbar="main"]');
  const homePage = document.querySelector('.home-page');
  console.log('🔒 Extended check results:', {
    navbarExists: !!navbar,
    homePageExists: !!homePage,
    timestamp: new Date().toISOString()
  });
}, 2000);
