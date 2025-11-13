
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Suppress harmless Razorpay console warnings
// 
// NOTE: "Refused to get unsafe header 'x-rtb-fingerprint-id'" warnings are:
// - Harmless browser security warnings (browsers block access to certain headers for security)
// - Expected behavior when Razorpay SDK tries to access fingerprint headers
// - Do NOT affect payment functionality - payments work perfectly fine
// - Cannot be completely suppressed as they're logged by browser's native security layer
// 
// This filter attempts to suppress them, but some may still appear in browser console.
// This is normal and safe to ignore.
//
// Must run early, before Razorpay scripts load
const originalError = console.error;
const originalWarn = console.warn;
const originalLog = console.log;

const isRazorpayWarning = (message: string): boolean => {
  if (typeof message !== 'string') {
    return false;
  }
  
  const messageLower = message.toLowerCase();
  
  // Don't filter our own error messages or legitimate API errors (they're important)
  if (messageLower.includes('razorpay payment failed') || 
      messageLower.includes('payment failed: error') ||
      messageLower.includes('400') ||
      messageLower.includes('bad request') ||
      messageLower.includes('incorrect card details') ||
      messageLower.includes('server_error') ||
      messageLower.includes('server error') ||
      messageLower.includes('facing some trouble') ||
      messageLower.includes('try again shortly')) {
    return false;
  }
  
  // Filter these specific Razorpay SDK warnings (harmless browser security warnings)
  const razorpayWarnings = [
    'refused to get unsafe header',
    'x-rtb-fingerprint-id',
    'expected length, "auto"',
    '<svg> attribute height',
    '<svg> attribute width',
    'svg attribute',
  ];
  
  // Filter stack traces from Razorpay SDK files (but not the actual error messages)
  const razorpaySDKFiles = [
    'v2-entry.modern.js',
    'checkout.js',
    'instrument.js',
    'trycatch.ts',
    'sentrywrapped',
  ];
  
  // Check if message contains the specific harmless warnings
  const hasWarning = razorpayWarnings.some(warning => 
    messageLower.includes(warning)
  );
  
  // Check if it's ONLY a stack trace from Razorpay SDK files (not an actual error)
  // Stack traces from SDK files are usually harmless
  const isOnlySDKStackTrace = razorpaySDKFiles.some(file => 
    messageLower.includes(file)
  ) && (
    messageLower.includes('onreadystatechange') ||
    messageLower.includes('at ') ||
    messageLower.includes('@')
  );
  
  return hasWarning || isOnlySDKStackTrace;
};

const filterConsoleMessage = (args: unknown[]): boolean => {
  // Join all arguments and check if it contains Razorpay warnings
  const fullMessage = args
    .map(arg => {
      if (typeof arg === 'string') return arg;
      if (arg && typeof arg === 'object' && 'message' in arg) {
        return String(arg.message);
      }
      if (arg && typeof arg === 'object' && 'stack' in arg) {
        return String(arg.stack);
      }
      try {
        return JSON.stringify(arg);
      } catch {
        return String(arg);
      }
    })
    .join(' ');
  
  // Check the full message
  if (isRazorpayWarning(fullMessage)) {
    return true;
  }
  
  // Also check individual arguments for stack traces
  for (const arg of args) {
    if (arg && typeof arg === 'object') {
      const stack = ('stack' in arg ? String(arg.stack) : null) || String(arg);
      if (typeof stack === 'string' && isRazorpayWarning(stack)) {
        return true;
      }
    }
  }
  
  return false;
};

// Check if Razorpay modal/checkout is currently active
const isRazorpayActive = (): boolean => {
  try {
    return !!(
      document.querySelector('.razorpay-checkout-frame') ||
      document.querySelector('.razorpay-container') ||
      document.querySelector('[class*="razorpay-checkout"]') ||
      document.querySelector('[id*="razorpay"]') ||
      (window as { Razorpay?: unknown }).Razorpay ||
      document.querySelector('iframe[src*="razorpay"]')
    );
  } catch {
    return false;
  }
};

// Enhanced console filtering with better detection
const shouldSuppressMessage = (args: unknown[]): boolean => {
  // First check our filter
  if (filterConsoleMessage(args)) {
    return true;
  }
  
  // Additional check: if Razorpay modal is open, be more aggressive
  if (isRazorpayActive()) {
    const fullMessage = args
      .map(arg => {
        if (typeof arg === 'string') return arg;
        if (arg && typeof arg === 'object' && 'message' in arg) {
          return String(arg.message);
        }
        if (arg && typeof arg === 'object' && 'stack' in arg) {
          return String(arg.stack);
        }
        try {
          return JSON.stringify(arg);
        } catch {
          return String(arg);
        }
      })
      .join(' ')
      .toLowerCase();
    
    // More aggressive filtering when Razorpay is active
    // Suppress any message containing these patterns
    const razorpayPatterns = [
      'refused to get unsafe header',
      'x-rtb-fingerprint-id',
      'v2-entry.modern.js',
      'onreadystatechange',
      'instrument.js',
      'trycatch.ts',
    ];
    
    // Check if message contains any Razorpay pattern
    const hasPattern = razorpayPatterns.some(pattern => 
      fullMessage.includes(pattern)
    );
    
    // Also check if it's a stack trace from Razorpay SDK
    const isSDKStackTrace = fullMessage.includes('v2-entry') && 
                           (fullMessage.includes('@') || fullMessage.includes('at '));
    
    if (hasPattern || isSDKStackTrace) {
      return true;
    }
  }
  
  return false;
};

console.error = (...args: unknown[]) => {
  // Filter out harmless Razorpay warnings
  if (!shouldSuppressMessage(args)) {
    originalError.apply(console, args);
  }
};

console.warn = (...args: unknown[]) => {
  // Filter out harmless Razorpay warnings
  if (!shouldSuppressMessage(args)) {
    originalWarn.apply(console, args);
  }
};

// Check if message is a development debug log that should be suppressed
const isDebugLog = (args: unknown[]): boolean => {
  const fullMessage = args
    .map(arg => {
      if (typeof arg === 'string') return arg;
      if (arg && typeof arg === 'object' && 'message' in arg) {
        return String(arg.message);
      }
      return String(arg);
    })
    .join(' ')
    .toLowerCase();
  
  // Development debug patterns to suppress
  const debugPatterns = [
    'userdashboardwrapper: current auth state',
    'navbaruseravatar: rendering with user',
    'navbaruseravatar: enhanced user data',
    '🔄 refreshing profiles for user',
    '🔄 current user state',
    '🔄 about to load profiles',
    '🔄 profile loading results',
    '🔄 auth: state change event',
    '📋 profile refresh results',
    '👤 loading user profile for',
    '👤 refreshprofiles completed',
    '👤 user authenticated, loading profiles',
    '🎯 loading expert profile for',
    '🔍 current authenticated user',
    '🔍 user id match',
    '🔍 testing basic',
    '🔍 basic query result',
    '🔍 expert query result',
    '👤 profiles query result',
    '📡 simpleauthcontext: context value updated',
    '✅ user only:',
    '✅ profiles refreshed',
    '✅ auth: initial check complete',
    'ℹ️ no expert profile found',
    'agora-sdk [debug]',
    'current web page is',
  ];
  
  return debugPatterns.some(pattern => fullMessage.includes(pattern));
};

// console.log = (...args: unknown[]) => {
//   // First check Razorpay warnings
//   if (shouldSuppressMessage(args)) {
//     return;
//   }
  
//   // Then check if it's a debug log (suppress in both dev and prod)
//   // You can change this to only suppress in production by using: import.meta.env.PROD
//   if (isDebugLog(args)) {
//     return;
//   }
  
//   // Allow non-debug logs
//   originalLog.apply(console, args);
// };

// Also intercept XMLHttpRequest to suppress Razorpay header warnings
if (typeof XMLHttpRequest !== 'undefined') {
  const OriginalXHROpen = XMLHttpRequest.prototype.open;
  const OriginalXHRSend = XMLHttpRequest.prototype.send;
  const OriginalGetResponseHeader = XMLHttpRequest.prototype.getResponseHeader;
  
  // Override getResponseHeader to catch and suppress "unsafe header" warnings
  // Browsers log warnings (not errors) when accessing certain headers, so we intercept here
  XMLHttpRequest.prototype.getResponseHeader = function(header: string) {
    // Check if this is a Razorpay fingerprint header (unsafe header)
    if (header && header.toLowerCase().includes('x-rtb-fingerprint-id')) {
      // Return null silently to prevent browser warning
      return null;
    }
    
    try {
      return OriginalGetResponseHeader.call(this, header);
    } catch (error: unknown) {
      // Suppress "unsafe header" warnings for Razorpay fingerprint headers
      const errorMsg = error && typeof error === 'object' && 'message' in error 
        ? String(error.message) 
        : String(error);
      if (errorMsg.includes('unsafe header') || 
          errorMsg.includes('x-rtb-fingerprint-id') ||
          header?.toLowerCase().includes('x-rtb')) {
        // Return null silently instead of throwing
        return null;
      }
      throw error;
    }
  };
  
  XMLHttpRequest.prototype.open = function(...args: unknown[]) {
    (this as { _url?: string })._url = String(args[1]);
    return OriginalXHROpen.apply(this, args);
  };
  
  XMLHttpRequest.prototype.send = function(...args: unknown[]) {
    const originalOnReadyStateChange = this.onreadystatechange;
    
    // Wrap onreadystatechange to catch and suppress Razorpay warnings
    this.onreadystatechange = function(...restArgs: unknown[]) {
      try {
        if (originalOnReadyStateChange) {
          originalOnReadyStateChange.apply(this, restArgs);
        }
      } catch (error: unknown) {
        // Suppress Razorpay-related XMLHttpRequest errors
        const errorMsg = error && typeof error === 'object' && 'message' in error 
          ? String(error.message) 
          : String(error);
        if (!isRazorpayWarning(errorMsg)) {
          originalError.call(console, 'XMLHttpRequest error:', error);
        }
      }
    };
    
    return OriginalXHRSend.apply(this, args);
  };
  
  // Also intercept getAllResponseHeaders to prevent header access warnings
  const OriginalGetAllResponseHeaders = XMLHttpRequest.prototype.getAllResponseHeaders;
  XMLHttpRequest.prototype.getAllResponseHeaders = function() {
    try {
      return OriginalGetAllResponseHeaders.call(this);
    } catch (error: unknown) {
      // Suppress header-related warnings
      const errorMsg = error && typeof error === 'object' && 'message' in error 
        ? String(error.message) 
        : String(error);
      if (errorMsg.includes('unsafe header') || errorMsg.includes('x-rtb')) {
        return '';
      }
      throw error;
    }
  };
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
