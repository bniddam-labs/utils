import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  createTypeGuard,
  createValidator,
  formatZodErrors,
  isValid,
  parse,
  safeParse,
  validateAll,
} from './validation.helpers';

const emailSchema = z.string().email();
const ageSchema = z.number().int().positive().max(120);
const userSchema = z.object({
  name: z.string().min(2),
  email: emailSchema,
  age: ageSchema,
});

describe('safeParse', () => {
  it('should return success for valid data', () => {
    const result = safeParse(emailSchema, 'user@example.com');

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('user@example.com');
      expect(result.errors).toBeNull();
    }
  });

  it('should return errors for invalid data', () => {
    const result = safeParse(emailSchema, 'invalid-email');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.data).toBeNull();
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.message).toContain('email');
    }
  });

  it('should handle complex nested schemas', () => {
    const result = safeParse(userSchema, {
      name: 'John',
      email: 'john@example.com',
      age: 30,
    });

    expect(result.success).toBe(true);
  });
});

describe('parse', () => {
  it('should return parsed data for valid input', () => {
    const data = parse(emailSchema, 'user@example.com');
    expect(data).toBe('user@example.com');
  });

  it('should throw for invalid input', () => {
    expect(() => parse(emailSchema, 'invalid')).toThrow();
  });
});

describe('isValid', () => {
  it('should return true for valid data', () => {
    expect(isValid(emailSchema, 'user@example.com')).toBe(true);
  });

  it('should return false for invalid data', () => {
    expect(isValid(emailSchema, 'invalid')).toBe(false);
  });

  it('should work as type guard', () => {
    const value: unknown = 'user@example.com';

    if (isValid(emailSchema, value)) {
      // value is now typed as string
      expect(value.toUpperCase()).toBe('USER@EXAMPLE.COM');
    }
  });
});

describe('validateAll', () => {
  it('should validate multiple values successfully', () => {
    const result = validateAll({
      email: [emailSchema, 'user@example.com'],
      age: [ageSchema, 25],
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('user@example.com');
      expect(result.data.age).toBe(25);
    }
  });

  it('should collect all validation errors', () => {
    const result = validateAll({
      email: [emailSchema, 'invalid'],
      age: [ageSchema, -5],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('formatZodErrors', () => {
  it('should format Zod errors correctly', () => {
    const result = userSchema.safeParse({
      name: 'A', // Too short
      email: 'invalid',
      age: 150, // Too high
    });

    if (!result.success) {
      const errors = formatZodErrors(result.error);

      expect(errors.length).toBeGreaterThanOrEqual(2);
      expect(errors.some((e) => e.path.includes('name'))).toBe(true);
      expect(errors.some((e) => e.path.includes('email'))).toBe(true);
    }
  });
});

describe('createValidator', () => {
  it('should create a validator function', () => {
    const validateEmail = createValidator(emailSchema);
    const result = validateEmail('user@example.com');

    expect(result.success).toBe(true);
  });
});

describe('createTypeGuard', () => {
  it('should create a type guard function', () => {
    const isEmail = createTypeGuard(emailSchema);

    expect(isEmail('user@example.com')).toBe(true);
    expect(isEmail('invalid')).toBe(false);
  });
});
