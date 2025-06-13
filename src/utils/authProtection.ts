
// Enhanced utility for protecting authentication during critical operations
export class AuthProtectionManager {
  private static instance: AuthProtectionManager;
  private protectedOperations: Set<string> = new Set();
  private criticalSessions: Set<string> = new Set();

  static getInstance(): AuthProtectionManager {
    if (!AuthProtectionManager.instance) {
      AuthProtectionManager.instance = new AuthProtectionManager();
    }
    return AuthProtectionManager.instance;
  }

  /**
   * Start protection for a critical operation
   */
  startProtection(operationId: string, type: 'video-call' | 'booking' | 'payment' = 'booking'): void {
    console.log(`🔒 Starting auth protection for: ${operationId} (type: ${type})`);
    this.protectedOperations.add(operationId);
    
    // Store protection state in sessionStorage for persistence across refreshes
    sessionStorage.setItem('authProtectedOperations', JSON.stringify(Array.from(this.protectedOperations)));
    sessionStorage.setItem(`authProtection_${operationId}`, JSON.stringify({
      type,
      startTime: Date.now(),
      operationId
    }));
    
    // Special handling for video calls
    if (type === 'video-call') {
      this.criticalSessions.add(operationId);
      sessionStorage.setItem('videoCallActive', 'true');
    }
  }

  /**
   * End protection for an operation
   */
  endProtection(operationId: string): void {
    console.log(`🔒 Ending auth protection for: ${operationId}`);
    this.protectedOperations.delete(operationId);
    this.criticalSessions.delete(operationId);
    
    // Clean up session storage
    sessionStorage.removeItem(`authProtection_${operationId}`);
    
    if (this.protectedOperations.size === 0) {
      sessionStorage.removeItem('authProtectedOperations');
      sessionStorage.removeItem('videoCallActive');
    } else {
      sessionStorage.setItem('authProtectedOperations', JSON.stringify(Array.from(this.protectedOperations)));
    }
  }

  /**
   * Check if any operation is currently protected
   */
  isProtected(): boolean {
    // Check both memory and session storage
    const stored = sessionStorage.getItem('authProtectedOperations');
    if (stored) {
      this.protectedOperations = new Set(JSON.parse(stored));
    }
    
    const hasVideoCall = sessionStorage.getItem('videoCallActive') === 'true';
    return this.protectedOperations.size > 0 || hasVideoCall;
  }

  /**
   * Get list of active protected operations
   */
  getActiveOperations(): Array<{operationId: string, type: string, startTime: number}> {
    const operations: Array<{operationId: string, type: string, startTime: number}> = [];
    
    this.protectedOperations.forEach(operationId => {
      const stored = sessionStorage.getItem(`authProtection_${operationId}`);
      if (stored) {
        operations.push(JSON.parse(stored));
      }
    });
    
    return operations;
  }

  /**
   * Force clear all protections (use with caution)
   */
  clearAllProtections(): void {
    console.log('🔒 Force clearing all auth protections');
    this.protectedOperations.clear();
    this.criticalSessions.clear();
    
    // Clear all related session storage
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith('authProtection_') || key === 'authProtectedOperations' || key === 'videoCallActive') {
        sessionStorage.removeItem(key);
      }
    });
  }

  /**
   * Check if a specific operation is protected
   */
  isOperationProtected(operationId: string): boolean {
    return this.protectedOperations.has(operationId);
  }
}

export const authProtection = AuthProtectionManager.getInstance();

/**
 * React hook for using auth protection in components
 */
export const useAuthProtection = () => {
  const startProtection = (operationId: string, type: 'video-call' | 'booking' | 'payment' = 'booking') => {
    authProtection.startProtection(operationId, type);
  };

  const endProtection = (operationId: string) => {
    authProtection.endProtection(operationId);
  };

  const isProtected = () => {
    return authProtection.isProtected();
  };

  const isOperationProtected = (operationId: string) => {
    return authProtection.isOperationProtected(operationId);
  };

  return {
    startProtection,
    endProtection,
    isProtected,
    isOperationProtected,
    getActiveOperations: () => authProtection.getActiveOperations()
  };
};
