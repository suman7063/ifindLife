
import { useEffect } from 'react';

const DebugDOMStatus = () => {
  useEffect(() => {
    const checkDOM = () => {
      console.log('🔒 DOM Debug Check:');
      console.log('  - Root element:', !!document.getElementById('root'));
      console.log('  - App container:', !!document.querySelector('.app'));
      console.log('  - All divs with app class:', document.querySelectorAll('.app').length);
      console.log('  - Navbar element:', !!document.querySelector('[data-navbar="main"]'));
      console.log('  - Any nav elements:', document.querySelectorAll('nav').length);
      console.log('  - Home page elements:', document.querySelectorAll('.home-page').length);
      console.log('  - Main content:', !!document.querySelector('.main-content'));
      console.log('  - Body children count:', document.body.children.length);
      console.log('  - React root children:', document.getElementById('root')?.children.length || 0);
      
      // Check for CSS issues
      const navbar = document.querySelector('[data-navbar="main"]');
      if (navbar) {
        const styles = window.getComputedStyle(navbar as Element);
        console.log('  - Navbar computed styles:', {
          display: styles.display,
          visibility: styles.visibility,
          opacity: styles.opacity,
          position: styles.position,
          zIndex: styles.zIndex
        });
      }
    };
    
    // Check immediately and after delays to catch async rendering
    checkDOM();
    setTimeout(checkDOM, 100);
    setTimeout(checkDOM, 500);
    setTimeout(checkDOM, 1000);
  }, []);
  
  return null;
};

export default DebugDOMStatus;
