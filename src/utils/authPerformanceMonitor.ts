interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  authStateChanges: number;
  loginAttempts: number;
  logoutAttempts: number;
  averageRenderTime: number;
}

class AuthPerformanceMonitor {
  private metrics: PerformanceMetrics = {
    renderCount: 0,
    lastRenderTime: 0,
    authStateChanges: 0,
    loginAttempts: 0,
    logoutAttempts: 0,
    averageRenderTime: 0
  };

  private renderTimes: number[] = [];
  private maxRenderTimes = 100; // Keep last 100 render times

  trackRender(componentName: string) {
    const now = performance.now();
    this.metrics.renderCount++;
    this.metrics.lastRenderTime = now;
    
    if (this.renderTimes.length > 0) {
      const renderDuration = now - this.renderTimes[this.renderTimes.length - 1];
      this.renderTimes.push(renderDuration);
      
      // Keep only recent render times
      if (this.renderTimes.length > this.maxRenderTimes) {
        this.renderTimes.shift();
      }
      
      // Calculate average
      this.metrics.averageRenderTime = this.renderTimes.reduce((a, b) => a + b, 0) / this.renderTimes.length;
    } else {
      this.renderTimes.push(now);
    }

    // Log performance warning if too many renders
    if (this.metrics.renderCount % 50 === 0) {
      console.warn(`🔒 Performance Warning: ${componentName} has rendered ${this.metrics.renderCount} times. Average render time: ${this.metrics.averageRenderTime.toFixed(2)}ms`);
    }
  }

  trackAuthStateChange(event: string, details?: any) {
    this.metrics.authStateChanges++;
    console.log(`🔒 Auth Performance: State change #${this.metrics.authStateChanges} - ${event}`, details);
  }

  trackLoginAttempt(type: 'user' | 'expert' | 'admin', success: boolean) {
    this.metrics.loginAttempts++;
    console.log(`🔒 Auth Performance: Login attempt #${this.metrics.loginAttempts} - ${type} - ${success ? 'SUCCESS' : 'FAILED'}`);
  }

  trackLogoutAttempt(success: boolean) {
    this.metrics.logoutAttempts++;
    console.log(`🔒 Auth Performance: Logout attempt #${this.metrics.logoutAttempts} - ${success ? 'SUCCESS' : 'FAILED'}`);
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  getPerformanceReport(): string {
    const report = `
🔒 Auth Performance Report:
- Total Renders: ${this.metrics.renderCount}
- Auth State Changes: ${this.metrics.authStateChanges}
- Login Attempts: ${this.metrics.loginAttempts}
- Logout Attempts: ${this.metrics.logoutAttempts}
- Average Render Time: ${this.metrics.averageRenderTime.toFixed(2)}ms
- Last Render: ${new Date(this.metrics.lastRenderTime).toISOString()}
    `;
    return report;
  }

  reset() {
    this.metrics = {
      renderCount: 0,
      lastRenderTime: 0,
      authStateChanges: 0,
      loginAttempts: 0,
      logoutAttempts: 0,
      averageRenderTime: 0
    };
    this.renderTimes = [];
    console.log('🔒 Auth Performance Monitor reset');
  }
}

export const authPerformanceMonitor = new AuthPerformanceMonitor();

// Expose to window for debugging
if (typeof window !== 'undefined') {
  (window as any).authPerformanceMonitor = authPerformanceMonitor;
}
