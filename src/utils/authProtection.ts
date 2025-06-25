
import React, { useState, useCallback } from 'react';

interface ProtectedOperation {
  id: string;
  type: 'video-call' | 'booking' | 'payment';
  startTime: Date;
}

class AuthProtectionManager {
  private operations: ProtectedOperation[] = [];
  private listeners: Set<() => void> = new Set();

  startProtection(operationId: string, type: 'video-call' | 'booking' | 'payment' = 'booking') {
    const operation: ProtectedOperation = {
      id: operationId,
      type,
      startTime: new Date()
    };
    
    this.operations.push(operation);
    console.log('🔒 Started auth protection:', operationId, type);
    this.notifyListeners();
  }

  endProtection(operationId: string) {
    const index = this.operations.findIndex(op => op.id === operationId);
    if (index !== -1) {
      this.operations.splice(index, 1);
      console.log('🔒 Ended auth protection:', operationId);
      this.notifyListeners();
    }
  }

  isProtected(): boolean {
    return this.operations.length > 0;
  }

  getActiveOperations(): ProtectedOperation[] {
    return [...this.operations];
  }

  clearAllProtections() {
    this.operations = [];
    console.log('🔒 Cleared all auth protections');
    this.notifyListeners();
  }

  addListener(listener: () => void) {
    this.listeners.add(listener);
  }

  removeListener(listener: () => void) {
    this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }
}

export const authProtection = new AuthProtectionManager();

export const useAuthProtection = () => {
  const [, forceUpdate] = useState({});

  const triggerUpdate = useCallback(() => {
    forceUpdate({});
  }, []);

  // Set up listener on mount
  React.useEffect(() => {
    authProtection.addListener(triggerUpdate);
    return () => authProtection.removeListener(triggerUpdate);
  }, [triggerUpdate]);

  return {
    startProtection: authProtection.startProtection.bind(authProtection),
    endProtection: authProtection.endProtection.bind(authProtection),
    isProtected: authProtection.isProtected.bind(authProtection),
    getActiveOperations: authProtection.getActiveOperations.bind(authProtection),
    clearAllProtections: authProtection.clearAllProtections.bind(authProtection)
  };
};
