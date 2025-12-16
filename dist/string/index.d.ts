import { z } from 'zod';

/**
 * Sanitize a filename to prevent path traversal and other attacks
 *
 * - Removes null bytes
 * - Keeps only alphanumeric, dots, hyphens, underscores
 * - Removes leading/trailing dots and underscores
 * - Collapses multiple dots
 * - Truncates to max length (default: 255)
 * - Ensures filename is not empty
 *
 * @param filename - Original filename
 * @param maxLength - Maximum filename length (default: 255)
 * @returns Sanitized filename
 *
 * @example
 * ```ts
 * sanitizeFilename('../../etc/passwd'); // 'etc_passwd'
 * sanitizeFilename('my file (1).txt'); // 'my_file_1.txt'
 * sanitizeFilename(''); // 'file.bin'
 * ```
 */
declare function sanitizeFilename(filename: string, maxLength?: number): string;
/**
 * Sanitize search input to prevent SQL wildcard abuse
 *
 * Escapes special characters used in SQL LIKE patterns:
 * - % (wildcard for any characters)
 * - _ (wildcard for single character)
 * - \ (escape character)
 *
 * @param search - Search string
 * @returns Sanitized search string
 *
 * @example
 * ```ts
 * sanitizeSearchInput('100%'); // '100\\%'
 * sanitizeSearchInput('user_test'); // 'user\\_test'
 * ```
 */
declare function sanitizeSearchInput(search: string): string;
/**
 * Truncate a string to a maximum length with ellipsis
 *
 * @param str - String to truncate
 * @param maxLength - Maximum length (default: 100)
 * @param ellipsis - Ellipsis string (default: '...')
 * @returns Truncated string
 *
 * @example
 * ```ts
 * truncate('This is a very long string', 10); // 'This is...'
 * truncate('Short', 10); // 'Short'
 * ```
 */
declare function truncate(str: string, maxLength?: number, ellipsis?: string): string;
/**
 * Remove all whitespace from a string
 *
 * @param str - String to process
 * @returns String without whitespace
 *
 * @example
 * ```ts
 * removeWhitespace('  hello  world  '); // 'helloworld'
 * ```
 */
declare function removeWhitespace(str: string): string;
/**
 * Normalize whitespace (collapse multiple spaces to single space and trim)
 *
 * @param str - String to normalize
 * @returns Normalized string
 *
 * @example
 * ```ts
 * normalizeWhitespace('  hello    world  '); // 'hello world'
 * ```
 */
declare function normalizeWhitespace(str: string): string;

/**
 * Mask an email address, keeping first few characters and domain visible
 *
 * @param email - Email address to mask
 * @param visibleChars - Number of visible characters at start (default: 2)
 * @returns Masked email
 *
 * @example
 * ```ts
 * maskEmail('john.doe@example.com'); // 'jo***@example.com'
 * maskEmail('a@test.com'); // 'a***@test.com'
 * ```
 */
declare function maskEmail(email: string, visibleChars?: number): string;
/**
 * Mask a phone number, keeping last few digits visible
 *
 * @param phone - Phone number to mask
 * @param visibleDigits - Number of visible digits at end (default: 4)
 * @returns Masked phone number
 *
 * @example
 * ```ts
 * maskPhone('+1234567890'); // '******7890'
 * maskPhone('555-123-4567', 4); // '***-***-4567'
 * ```
 */
declare function maskPhone(phone: string, visibleDigits?: number): string;
/**
 * Mask a credit card number, keeping last 4 digits visible
 *
 * @param cardNumber - Card number to mask
 * @param visibleDigits - Number of visible digits at end (default: 4)
 * @param separator - Separator character (default: ' ')
 * @returns Masked card number
 *
 * @example
 * ```ts
 * maskCardNumber('1234567812345678'); // '**** **** **** 5678'
 * maskCardNumber('1234-5678-1234-5678', 4, '-'); // '****-****-****-5678'
 * ```
 */
declare function maskCardNumber(cardNumber: string, visibleDigits?: number, separator?: string): string;
/**
 * Mask a string, keeping first and last few characters visible
 *
 * @param str - String to mask
 * @param visibleStart - Number of visible characters at start (default: 2)
 * @param visibleEnd - Number of visible characters at end (default: 2)
 * @param maskChar - Masking character (default: '*')
 * @returns Masked string
 *
 * @example
 * ```ts
 * maskString('secrettoken123', 2, 2); // 'se********23'
 * maskString('abc', 1, 1); // 'a*c'
 * ```
 */
declare function maskString(str: string, visibleStart?: number, visibleEnd?: number, maskChar?: string): string;

/**
 * Zod schema for email validation
 */
declare const emailSchema: z.ZodEmail;
/**
 * Zod schema for phone number validation (international format)
 */
declare const phoneSchema: z.ZodString;
/**
 * Zod schema for URL validation
 */
declare const urlSchema: z.ZodString;
/**
 * Zod schema for safe filename (sanitized)
 */
declare const filenameSchema: z.ZodString;
/**
 * Zod schema for slug (URL-friendly string)
 */
declare const slugStringSchema: z.ZodString;
/**
 * Zod schema for non-empty trimmed string
 */
declare const nonEmptyStringSchema: z.ZodString;
/**
 * Zod schema for alphanumeric string
 */
declare const alphanumericSchema: z.ZodString;
/**
 * Zod schema for hex color code
 */
declare const hexColorSchema: z.ZodString;
/**
 * Create a Zod schema for string with min/max length
 */
declare const createStringSchema: (min: number, max: number, message?: string) => z.ZodString;
/**
 * Create a Zod schema for enum from string array
 */
declare const createEnumSchema: <T extends readonly [string, ...string[]]>(values: T) => z.ZodEnum<{ [k_1 in T[number]]: k_1; } extends infer T_1 ? { [k in keyof T_1]: T_1[k]; } : never>;

export { alphanumericSchema, createEnumSchema, createStringSchema, emailSchema, filenameSchema, hexColorSchema, maskCardNumber, maskEmail, maskPhone, maskString, nonEmptyStringSchema, normalizeWhitespace, phoneSchema, removeWhitespace, sanitizeFilename, sanitizeSearchInput, slugStringSchema, truncate, urlSchema };
