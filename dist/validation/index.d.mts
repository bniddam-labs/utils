import { ZodSchema, ZodError } from 'zod';

/**
 * Validation result with parsed data or errors
 */
type ValidationResult<T> = {
    success: true;
    data: T;
    errors: null;
} | {
    success: false;
    data: null;
    errors: ValidationError[];
};
/**
 * Simplified validation error
 */
interface ValidationError {
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
declare function safeParse<T>(schema: ZodSchema<T>, data: unknown): ValidationResult<T>;
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
declare function parse<T>(schema: ZodSchema<T>, data: unknown): T;
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
declare function validateAll<T extends Record<string, [ZodSchema<any>, unknown]>>(validations: T): ValidationResult<{
    [K in keyof T]: T[K][0] extends ZodSchema<infer U> ? U : never;
}>;
/**
 * Check if data matches a schema without parsing
 *
 * @param schema - Zod schema
 * @param data - Data to check
 * @returns True if valid
 */
declare function isValid<T>(schema: ZodSchema<T>, data: unknown): data is T;
/**
 * Format Zod errors into a simpler structure
 *
 * @param error - Zod error
 * @returns Array of simplified errors
 */
declare function formatZodErrors(error: ZodError): ValidationError[];
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
declare function createValidator<T>(schema: ZodSchema<T>): (data: unknown) => ValidationResult<T>;
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
declare function createTypeGuard<T>(schema: ZodSchema<T>): (data: unknown) => data is T;

export { type ValidationError, type ValidationResult, createTypeGuard, createValidator, formatZodErrors, isValid, parse, safeParse, validateAll };
