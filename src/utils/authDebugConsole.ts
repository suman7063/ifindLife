
import { authPerformanceMonitor } from './authPerformanceMonitor';
import { authTestingUtils } from './authTestingUtils';

class AuthDebugConsole {
  private isEnabled = process.env.NODE_ENV === 'development';
  private logHistory: string[] = [];
  private maxHistorySize = 1000;

  log(message: string, data?: any) {
    if (!this.isEnabled) return;
    
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    
    console.log(`🔒 ${logEntry}`, data || '');
    
    this.logHistory.push(logEntry);
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift();
    }
  }

  error(message: string, error?: any) {
    if (!this.isEnabled) return;
    
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ERROR: ${message}`;
    
    console.error(`🔒 ${logEntry}`, error || '');
    
    this.logHistory.push(logEntry);
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift();
    }
  }

  warn(message: string, data?: any) {
    if (!this.isEnabled) return;
    
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] WARNING: ${message}`;
    
    console.warn(`🔒 ${logEntry}`, data || '');
    
    this.logHistory.push(logEntry);
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift();
    }
  }

  getLogHistory(): string[] {
    return [...this.logHistory];
  }

  clearHistory() {
    this.logHistory = [];
    console.log('🔒 Auth debug log history cleared');
  }

  exportLogs(): string {
    return this.logHistory.join('\n');
  }

  getDebugInfo() {
    const performanceMetrics = authPerformanceMonitor.getMetrics();
    const sessionInfo = {
      storedSessionType: localStorage.getItem('sessionType'),
      timestamp: new Date().toISOString()
    };
    
    return {
      performance: performanceMetrics,
      session: sessionInfo,
      logCount: this.logHistory.length,
      enabled: this.isEnabled
    };
  }

  async runQuickTest() {
    console.log('🔒 Running quick auth test...');
    const { results, summary } = await authTestingUtils.runFullAuthTest();
    console.log('🔒 Quick test completed:', summary);
    return { results, summary };
  }

  enable() {
    this.isEnabled = true;
    console.log('🔒 Auth debug console enabled');
  }

  disable() {
    this.isEnabled = false;
    console.log('🔒 Auth debug console disabled');
  }
}

export const authDebugConsole = new AuthDebugConsole();

// Expose to window for debugging
if (typeof window !== 'undefined') {
  (window as any).authDebugConsole = authDebugConsole;
  (window as any).authDebug = {
    console: authDebugConsole,
    performance: authPerformanceMonitor,
    testing: authTestingUtils,
    runTest: () => authTestingUtils.runFullAuthTest(),
    getPerformance: () => authPerformanceMonitor.getPerformanceReport(),
    clearAll: () => {
      authDebugConsole.clearHistory();
      authPerformanceMonitor.reset();
    }
  };
  
  console.log('🔒 Auth Debug Tools Available:');
  console.log('- window.authDebug.console - Debug logging');
  console.log('- window.authDebug.performance - Performance monitoring');
  console.log('- window.authDebug.testing - Authentication testing');
  console.log('- window.authDebug.runTest() - Run full auth test suite');
  console.log('- window.authDebug.getPerformance() - Get performance report');
  console.log('- window.authDebug.clearAll() - Clear all debug data');
}
