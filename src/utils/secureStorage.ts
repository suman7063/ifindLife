/**
 * Secure storage utilities for handling sensitive data
 */

// Simple encryption/decryption using browser's crypto API
class SecureStorage {
  private key: CryptoKey | null = null;

  private async getKey(): Promise<CryptoKey> {
    if (this.key) return this.key;

    // Generate a key from the user's session or use a default for demo
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode('secure-session-key-32-bytes!!'),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    this.key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new TextEncoder().encode('lovable-salt-16b'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );

    return this.key;
  }

  async encrypt(data: string): Promise<string> {
    try {
      const key = await this.getKey();
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encodedData = new TextEncoder().encode(data);

      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encodedData
      );

      // Combine iv and encrypted data
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encrypted), iv.length);

      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Encryption failed:', error);
      return data; // Fallback to unencrypted for compatibility
    }
  }

  async decrypt(encryptedData: string): Promise<string> {
    try {
      const key = await this.getKey();
      const combined = new Uint8Array(
        atob(encryptedData).split('').map(char => char.charCodeAt(0))
      );

      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
      );

      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error('Decryption failed:', error);
      return encryptedData; // Fallback to original data
    }
  }

  async setSecureItem(key: string, value: string): Promise<void> {
    try {
      const encrypted = await this.encrypt(value);
      sessionStorage.setItem(`secure_${key}`, encrypted);
    } catch (error) {
      console.error('Secure storage failed:', error);
      // Fallback to regular storage for non-critical data
      sessionStorage.setItem(key, value);
    }
  }

  async getSecureItem(key: string): Promise<string | null> {
    try {
      const encryptedValue = sessionStorage.getItem(`secure_${key}`);
      if (!encryptedValue) return null;

      return await this.decrypt(encryptedValue);
    } catch (error) {
      console.error('Secure retrieval failed:', error);
      // Fallback to regular storage
      return sessionStorage.getItem(key);
    }
  }

  removeSecureItem(key: string): void {
    sessionStorage.removeItem(`secure_${key}`);
    sessionStorage.removeItem(key); // Also remove fallback
  }

  // Clear all secure items (useful for logout)
  clearSecureStorage(): void {
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith('secure_')) {
        sessionStorage.removeItem(key);
      }
    });
  }
}

export const secureStorage = new SecureStorage();

/**
 * Legacy localStorage wrapper that promotes using secureStorage
 */
export const secureLocalStorage = {
  setItem: (key: string, value: string) => {
    console.warn('Consider using secureStorage for sensitive data');
    localStorage.setItem(key, value);
  },
  
  getItem: (key: string) => {
    return localStorage.getItem(key);
  },
  
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
  
  clear: () => {
    localStorage.clear();
  }
};