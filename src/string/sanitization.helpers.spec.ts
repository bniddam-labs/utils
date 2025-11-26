import { describe, expect, it } from 'vitest';
import {
  normalizeWhitespace,
  removeWhitespace,
  sanitizeFilename,
  sanitizeSearchInput,
  truncate,
} from './sanitization.helpers';

describe('sanitizeFilename', () => {
  it('should keep safe characters', () => {
    expect(sanitizeFilename('my-file_123.txt')).toBe('my-file_123.txt');
  });

  it('should replace dangerous characters', () => {
    expect(sanitizeFilename('my file (1).txt')).toBe('my_file__1_.txt');
  });

  it('should prevent path traversal', () => {
    expect(sanitizeFilename('../../etc/passwd')).toBe('etc_passwd');
    expect(sanitizeFilename('../file.txt')).toBe('file.txt');
  });

  it('should remove null bytes', () => {
    expect(sanitizeFilename('file\0name.txt')).toBe('filename.txt');
  });

  it('should collapse multiple dots', () => {
    expect(sanitizeFilename('file...txt')).toBe('file.txt');
  });

  it('should truncate long filenames', () => {
    const longName = `${'a'.repeat(300)}.txt`;
    const result = sanitizeFilename(longName);
    expect(result.length).toBe(255);
    expect(result.endsWith('.txt')).toBe(true);
  });

  it('should handle empty filename', () => {
    expect(sanitizeFilename('')).toBe('file.bin');
    expect(sanitizeFilename('...')).toBe('file.bin');
  });

  it('should preserve extension', () => {
    expect(sanitizeFilename('test.tar.gz')).toBe('test.tar.gz');
  });
});

describe('sanitizeSearchInput', () => {
  it('should escape SQL wildcards', () => {
    expect(sanitizeSearchInput('100%')).toBe('100\\%');
    expect(sanitizeSearchInput('user_test')).toBe('user\\_test');
    expect(sanitizeSearchInput('path\\file')).toBe('path\\\\file');
  });

  it('should handle multiple special characters', () => {
    expect(sanitizeSearchInput('50%_off')).toBe('50\\%\\_off');
  });

  it('should not modify safe strings', () => {
    expect(sanitizeSearchInput('hello world')).toBe('hello world');
  });
});

describe('truncate', () => {
  it('should truncate long strings', () => {
    expect(truncate('This is a very long string', 10)).toBe('This is...');
  });

  it('should not truncate short strings', () => {
    expect(truncate('Short', 10)).toBe('Short');
  });

  it('should use custom ellipsis', () => {
    expect(truncate('This is a very long string', 10, '---')).toBe('This is---');
  });
});

describe('removeWhitespace', () => {
  it('should remove all whitespace', () => {
    expect(removeWhitespace('  hello  world  ')).toBe('helloworld');
  });

  it('should handle tabs and newlines', () => {
    expect(removeWhitespace('hello\tworld\n')).toBe('helloworld');
  });
});

describe('normalizeWhitespace', () => {
  it('should collapse multiple spaces', () => {
    expect(normalizeWhitespace('  hello    world  ')).toBe('hello world');
  });

  it('should trim edges', () => {
    expect(normalizeWhitespace('   test   ')).toBe('test');
  });
});
