import { describe, it, expect } from 'vitest';
import { sanitizeString, sanitizeForDisplay, isCleanEmail, isCleanPhone } from '@shared/security/sanitize';

describe('sanitizeString', () => {
  it('removes script tags', () => {
    const input = 'Hello <script>alert("xss")</script> world';
    const result = sanitizeString(input);
    expect(result).not.toContain('<script');
    expect(result).not.toContain('alert');
  });

  it('removes event handlers', () => {
    const input = '<img onerror="alert(1)" src=x>';
    const result = sanitizeString(input);
    expect(result).not.toContain('onerror');
  });

  it('removes javascript: protocol', () => {
    const input = '<a href="javascript:alert(1)">click</a>';
    const result = sanitizeString(input);
    expect(result).not.toContain('javascript:');
  });

  it('escapes HTML entities', () => {
    const result = sanitizeString('Tom & Jerry <3 "cats"');
    expect(result).toContain('&amp;');
    expect(result).toContain('&lt;');
    expect(result).toContain('&quot;');
  });

  it('trims whitespace', () => {
    expect(sanitizeString('  hello  ')).toBe('hello');
  });

  it('handles empty string', () => {
    expect(sanitizeString('')).toBe('');
  });
});

describe('sanitizeForDisplay', () => {
  it('escapes angle brackets', () => {
    expect(sanitizeForDisplay('<b>bold</b>')).toBe('&lt;b&gt;bold&lt;/b&gt;');
  });

  it('preserves normal text', () => {
    expect(sanitizeForDisplay('Hello world')).toBe('Hello world');
  });
});

describe('isCleanEmail', () => {
  it('accepts valid emails', () => {
    expect(isCleanEmail('test@example.com')).toBe(true);
    expect(isCleanEmail('user.name+tag@domain.co.uk')).toBe(true);
  });

  it('rejects invalid emails', () => {
    expect(isCleanEmail('not-email')).toBe(false);
    expect(isCleanEmail('@domain.com')).toBe(false);
    expect(isCleanEmail('user@')).toBe(false);
    expect(isCleanEmail('')).toBe(false);
  });

  it('rejects overly long emails', () => {
    const long = 'a'.repeat(250) + '@b.com';
    expect(isCleanEmail(long)).toBe(false);
  });
});

describe('isCleanPhone', () => {
  it('accepts valid phone numbers', () => {
    expect(isCleanPhone('+33612345678')).toBe(true);
    expect(isCleanPhone('06 12 34 56 78')).toBe(true);
    expect(isCleanPhone('+1 (555) 123-4567')).toBe(true);
  });

  it('rejects invalid phones', () => {
    expect(isCleanPhone('abc')).toBe(false);
    expect(isCleanPhone('12345')).toBe(false);
    expect(isCleanPhone('')).toBe(false);
  });
});
