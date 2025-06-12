
// Utility for protecting authentication during video calls
export class AuthProtectionManager {
  private static instance: AuthProtectionManager;
  private protectedOperations: Set<string> = new Set();

  static getInstance(): AuthProtectionManager {
    if (!AuthProtectionManager.instance) {
      AuthProtectionManager.instance = new AuthProtectionManager();
    }
    return AuthProtectionManager.instance;
  }

  startProtection(operationId: string): void {
    console.log(`🔒 Starting auth protection for: ${operationId}`);
    this.protectedOperations.add(operationId);
    sessionStorage.setItem('authProtectedOperations', JSON.stringify(Array.from(this.protectedOperations)));
  }

  endProtection(operationId: string): void {
    console.log(`🔒 Ending auth protection for: ${operationId}`);
    this.protectedOperations.delete(operationId);
    
    if (this.protectedOperations.size === 0) {
      sessionStorage.removeItem('authProtectedOperations');
      sessionStorage.removeItem('videoCallActive');
    } else {
      sessionStorage.setItem('authProtectedOperations', JSON.stringify(Array.from(this.protectedOperations)));
    }
  }

  isProtected(): boolean {
    const stored = sessionStorage.getItem('authProtectedOperations');
    if (stored) {
      this.protectedOperations = new Set(JSON.parse(stored));
    }
    return this.protectedOperations.size > 0 || sessionStorage.getItem('videoCallActive') === 'true';
  }

  getActiveOperations(): string[] {
    return Array.from(this.protectedOperations);
  }
}

export const authProtection = AuthProtectionManager.getInstance();
