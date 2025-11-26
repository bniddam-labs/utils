import { z } from 'zod';

/**
 * Zod schema for email validation
 */
export const emailSchema = z.string().email('Invalid email address');

/**
 * Zod schema for phone number validation (international format)
 */
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format (E.164 format expected)');

/**
 * Zod schema for URL validation
 */
export const urlSchema = z.string().url('Invalid URL format');

/**
 * Zod schema for safe filename (sanitized)
 */
export const filenameSchema = z
  .string()
  .min(1, 'Filename cannot be empty')
  .max(255, 'Filename too long')
  .regex(/^[a-zA-Z0-9._-]+$/, 'Filename contains invalid characters');

/**
 * Zod schema for slug (URL-friendly string)
 */
export const slugStringSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Invalid slug format');

/**
 * Zod schema for non-empty trimmed string
 */
export const nonEmptyStringSchema = z.string().trim().min(1, 'String cannot be empty');

/**
 * Zod schema for alphanumeric string
 */
export const alphanumericSchema = z
  .string()
  .regex(/^[a-zA-Z0-9]+$/, 'Must contain only letters and numbers');

/**
 * Zod schema for hex color code
 */
export const hexColorSchema = z
  .string()
  .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color format');

/**
 * Create a Zod schema for string with min/max length
 */
export const createStringSchema = (min: number, max: number, message?: string) =>
  z.string().min(min, message).max(max, message);

/**
 * Create a Zod schema for enum from string array
 */
export const createEnumSchema = <T extends readonly [string, ...string[]]>(values: T) =>
  z.enum(values);
