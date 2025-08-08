/**
 * Comprehensive input sanitization utilities
 */

import { sanitizeInput } from './securityHelpers';

/**
 * Sanitize form data recursively
 */
export const sanitizeFormData = <T extends Record<string, any>>(data: T): T => {
  const sanitized = {} as T;
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitizeInput(value) as T[keyof T];
    } else if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        sanitized[key as keyof T] = value.map(item => 
          typeof item === 'string' ? sanitizeInput(item) : item
        ) as T[keyof T];
      } else {
        sanitized[key as keyof T] = sanitizeFormData(value) as T[keyof T];
      }
    } else {
      sanitized[key as keyof T] = value;
    }
  }
  
  return sanitized;
};

/**
 * Sanitize HTML content for display
 */
export const sanitizeHtmlContent = (html: string): string => {
  if (!html || typeof html !== 'string') return '';
  
  // Remove script tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove dangerous attributes
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s*javascript:\s*[^"'\s>]*/gi, '');
  sanitized = sanitized.replace(/\s*data:\s*[^"'\s>]*/gi, '');
  
  // Remove potentially dangerous tags
  const dangerousTags = ['iframe', 'object', 'embed', 'form', 'input', 'textarea', 'button', 'select'];
  dangerousTags.forEach(tag => {
    const regex = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'gi');
    sanitized = sanitized.replace(regex, '');
  });
  
  return sanitized.trim();
};

/**
 * Validate and sanitize URL inputs
 */
export const sanitizeUrlInput = (url: string): string | null => {
  if (!url || typeof url !== 'string') return null;
  
  // Remove potential XSS attempts
  const cleaned = url.replace(/[<>"']/g, '');
  
  try {
    const parsed = new URL(cleaned, window.location.origin);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }
    
    return parsed.toString();
  } catch {
    return null;
  }
};

/**
 * Sanitize text content for safe display
 */
export const sanitizeTextContent = (text: string, maxLength: number = 1000): string => {
  if (!text || typeof text !== 'string') return '';
  
  return sanitizeInput(text).slice(0, maxLength);
};