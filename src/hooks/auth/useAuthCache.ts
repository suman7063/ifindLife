
import { useCallback, useRef, useState } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

interface AuthCacheConfig {
  defaultTTL: number; // Time to live in milliseconds
  maxSize: number;    // Maximum cache entries
}

const DEFAULT_CONFIG: AuthCacheConfig = {
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  maxSize: 50
};

/**
 * High-performance authentication data caching hook
 * Reduces API calls and improves response times
 */
export const useAuthCache = <T = any>(config: Partial<AuthCacheConfig> = {}) => {
  const { defaultTTL, maxSize } = { ...DEFAULT_CONFIG, ...config };
  const cacheRef = useRef<Map<string, CacheEntry<T>>>(new Map());
  const [hitRate, setHitRate] = useState({ hits: 0, misses: 0 });

  // Clean expired entries
  const cleanExpired = useCallback(() => {
    const now = Date.now();
    const cache = cacheRef.current;
    
    for (const [key, entry] of cache.entries()) {
      if (now > entry.timestamp + entry.expiry) {
        cache.delete(key);
      }
    }
  }, []);

  // Enforce cache size limit using LRU
  const enforceSizeLimit = useCallback(() => {
    const cache = cacheRef.current;
    if (cache.size > maxSize) {
      const entries = Array.from(cache.entries());
      entries.sort(([,a], [,b]) => a.timestamp - b.timestamp);
      
      // Remove oldest entries
      const toRemove = entries.slice(0, cache.size - maxSize);
      toRemove.forEach(([key]) => cache.delete(key));
    }
  }, [maxSize]);

  const set = useCallback((key: string, data: T, customTTL?: number) => {
    cleanExpired();
    
    const cache = cacheRef.current;
    cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: customTTL || defaultTTL
    });
    
    enforceSizeLimit();
  }, [defaultTTL, cleanExpired, enforceSizeLimit]);

  const get = useCallback((key: string): T | null => {
    cleanExpired();
    
    const cache = cacheRef.current;
    const entry = cache.get(key);
    
    if (!entry) {
      setHitRate(prev => ({ ...prev, misses: prev.misses + 1 }));
      return null;
    }
    
    const now = Date.now();
    if (now > entry.timestamp + entry.expiry) {
      cache.delete(key);
      setHitRate(prev => ({ ...prev, misses: prev.misses + 1 }));
      return null;
    }
    
    // Update timestamp for LRU
    entry.timestamp = now;
    setHitRate(prev => ({ ...prev, hits: prev.hits + 1 }));
    return entry.data;
  }, [cleanExpired]);

  const invalidate = useCallback((key?: string) => {
    const cache = cacheRef.current;
    if (key) {
      cache.delete(key);
    } else {
      cache.clear();
      setHitRate({ hits: 0, misses: 0 });
    }
  }, []);

  const getStats = useCallback(() => {
    const cache = cacheRef.current;
    const total = hitRate.hits + hitRate.misses;
    
    return {
      size: cache.size,
      hitRate: total > 0 ? (hitRate.hits / total) * 100 : 0,
      hits: hitRate.hits,
      misses: hitRate.misses
    };
  }, [hitRate]);

  return {
    set,
    get,
    invalidate,
    getStats,
    cleanExpired
  };
};
