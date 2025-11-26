import type { ZodError, ZodIssue, ZodSchema } from 'zod';

/**
 * Validation result with parsed data or errors
 */
export type ValidationResult<T> =
  | { success: true; data: T; errors: null }
  | { success: false; data: null; errors: ValidationError[] };

/**
 * Simplified validation error
 */
export interface ValidationError {
  /** Field path (e.g., 'email', 'user.profile.name') */
  path: string;
  /** Error message */
  message: string;
  /** Error code (e.g., 'invalid_type', 'too_small') */
  code: string;
}

/**
 * Safely parse data with a Zod schema, returning a result object
 *
 * @param schema - Zod schema
 * @param data - Data to validate
 * @returns Validation result with success flag
 *
 * @example
 * ```ts
 * const result = safeParse(emailSchema, 'user@example.com');
 * if (result.success) {
 *   console.log(result.data); // Typed!
 * } else {
 *   console.log(result.errors);
 * }
 * ```
 */
export function safeParse<T>(schema: ZodSchema<T>, data: unknown): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
      errors: null,
    };
  }

  return {
    success: false,
    data: null,
    errors: formatZodErrors(result.error),
  };
}

/**
 * Parse data with a Zod schema, throwing on validation error
 *
 * @param schema - Zod schema
 * @param data - Data to validate
 * @returns Parsed and validated data
 * @throws ValidationError if validation fails
 *
 * @example
 * ```ts
 * try {
 *   const email = parse(emailSchema, userInput);
 *   // email is typed and validated
 * } catch (error) {
 *   // Handle validation errors
 * }
 * ```
 */
export function parse<T>(schema: ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Validate multiple values with different schemas
 *
 * @param validations - Object mapping keys to [schema, value] tuples
 * @returns Validation result with all validated data
 *
 * @example
 * ```ts
 * const result = validateAll({
 *   email: [emailSchema, userEmail],
 *   age: [z.number().positive(), userAge],
 * });
 * ```
 */
export function validateAll<T extends Record<string, [ZodSchema<any>, unknown]>>(
  validations: T,
): ValidationResult<{
  [K in keyof T]: T[K][0] extends ZodSchema<infer U> ? U : never;
}> {
  const errors: ValidationError[] = [];
  const data: Record<string, unknown> = {};

  for (const [key, [schema, value]] of Object.entries(validations)) {
    const result = safeParse(schema, value);
    if (result.success) {
      data[key] = result.data;
    } else {
      errors.push(
        ...result.errors.map((err) => ({
          ...err,
          path: `${key}.${err.path}`,
        })),
      );
    }
  }

  if (errors.length > 0) {
    return {
      success: false,
      data: null,
      errors,
    };
  }

  return {
    success: true,
    data: data as any,
    errors: null,
  };
}

/**
 * Check if data matches a schema without parsing
 *
 * @param schema - Zod schema
 * @param data - Data to check
 * @returns True if valid
 */
export function isValid<T>(schema: ZodSchema<T>, data: unknown): data is T {
  return schema.safeParse(data).success;
}

/**
 * Format Zod errors into a simpler structure
 *
 * @param error - Zod error
 * @returns Array of simplified errors
 */
export function formatZodErrors(error: ZodError): ValidationError[] {
  return error.issues.map((err: ZodIssue) => ({
    path: err.path.join('.') || 'root',
    message: err.message,
    code: err.code,
  }));
}

/**
 * Create a validator function from a Zod schema
 *
 * @param schema - Zod schema
 * @returns Validator function
 *
 * @example
 * ```ts
 * const validateEmail = createValidator(emailSchema);
 * const result = validateEmail(userInput);
 * ```
 */
export function createValidator<T>(schema: ZodSchema<T>) {
  return (data: unknown): ValidationResult<T> => safeParse(schema, data);
}

/**
 * Create a type guard from a Zod schema
 *
 * @param schema - Zod schema
 * @returns Type guard function
 *
 * @example
 * ```ts
 * const isEmail = createTypeGuard(emailSchema);
 * if (isEmail(value)) {
 *   // value is string (email)
 * }
 * ```
 */
export function createTypeGuard<T>(schema: ZodSchema<T>) {
  return (data: unknown): data is T => isValid(schema, data);
}
