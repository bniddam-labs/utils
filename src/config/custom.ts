import { getEnv, parseArray, parseBoolean, parseNumber } from './utils.js';

/**
 * Custom configuration helpers for extending the core config system
 * These utilities help load custom configuration sections from environment variables
 */

/**
 * Helper to convert a property path to environment variable name
 * Examples:
 *   - 'url' with prefix 'CUSTOM_SERVICE_' -> 'CUSTOM_SERVICE_URL'
 *   - 'credentials.username' with prefix 'API_' -> 'API_CREDENTIALS_USERNAME'
 */
export function toEnvVarName(path: string, prefix: string): string {
  return `${prefix}${path.replace(/\./g, '_').toUpperCase()}`;
}

/**
 * Loads a value from environment variables with automatic type parsing
 * Handles strings, numbers, booleans, and arrays
 */
export function loadEnvValue(
  envVarName: string,
  defaultValue?: any,
  type?: 'string' | 'number' | 'boolean' | 'array',
): any {
  const value = process.env[envVarName];

  if (value === undefined) {
    return defaultValue;
  }

  // Auto-detect type if not specified
  if (!type) {
    if (defaultValue !== undefined) {
      if (typeof defaultValue === 'number') type = 'number';
      else if (typeof defaultValue === 'boolean') type = 'boolean';
      else if (Array.isArray(defaultValue)) type = 'array';
      else type = 'string';
    } else {
      type = 'string';
    }
  }

  switch (type) {
    case 'number':
      return parseNumber(value, defaultValue);
    case 'boolean':
      return parseBoolean(value, defaultValue);
    case 'array':
      return parseArray(value, defaultValue);
    case 'string':
    default:
      return getEnv(envVarName, defaultValue);
  }
}

/**
 * Type for custom environment loaders
 */
export type CustomEnvLoader<T = any> = (prefix: string) => T;

/**
 * Creates a simple environment loader for flat object structures
 *
 * @param prefix - Environment variable prefix (e.g., 'CUSTOM_SERVICE_')
 * @param mapping - Object mapping property names to default values
 * @returns Loader function that reads from environment variables
 *
 * @example
 * ```typescript
 * const loader = createSimpleEnvLoader('CUSTOM_SERVICE_', {
 *   url: 'http://localhost:3000',
 *   apiKey: '',
 *   timeout: 5000,
 *   enabled: false
 * });
 * const config = loader('CUSTOM_SERVICE_');
 * // Reads: CUSTOM_SERVICE_URL, CUSTOM_SERVICE_API_KEY, etc.
 * ```
 */
export function createSimpleEnvLoader<T extends Record<string, any>>(
  mapping: T,
): CustomEnvLoader<T> {
  return (prefix: string) => {
    const result: any = {};

    for (const [key, defaultValue] of Object.entries(mapping)) {
      const envVarName = toEnvVarName(key, prefix);
      result[key] = loadEnvValue(envVarName, defaultValue);
    }

    return result as T;
  };
}

/**
 * Creates an environment loader with nested object support
 *
 * @param prefix - Environment variable prefix
 * @param mapping - Object with nested structure and default values
 * @returns Loader function that handles nested properties
 *
 * @example
 * ```typescript
 * const loader = createNestedEnvLoader('API_', {
 *   url: 'http://localhost',
 *   credentials: {
 *     username: 'admin',
 *     password: 'secret'
 *   },
 *   timeout: 5000
 * });
 * // Reads: API_URL, API_CREDENTIALS_USERNAME, API_CREDENTIALS_PASSWORD, API_TIMEOUT
 * ```
 */
export function createNestedEnvLoader<T extends Record<string, any>>(
  mapping: T,
): CustomEnvLoader<T> {
  return (prefix: string) => {
    const loadNested = (obj: any, path: string[] = []): any => {
      if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
        // Leaf value - load from environment
        const fullPath = path.join('.');
        const envVarName = toEnvVarName(fullPath, prefix);
        return loadEnvValue(envVarName, obj);
      }

      // Object - recurse into properties
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = loadNested(value, [...path, key]);
      }
      return result;
    };

    return loadNested(mapping) as T;
  };
}

/**
 * Helper to create a loader from a plain config object (no env loading)
 * Useful when you want to provide config values directly
 *
 * @example
 * ```typescript
 * const loader = createStaticLoader({
 *   url: 'https://api.example.com',
 *   apiKey: process.env.MY_API_KEY,
 *   credentials: { username: 'user', password: 'pass' }
 * });
 * ```
 */
export function createStaticLoader<T>(config: T): CustomEnvLoader<T> {
  return () => config;
}

/**
 * Type for loader input - can be a prefix string, loader function, or static config
 */
export type LoaderInput<T> = string | CustomEnvLoader<T> | T;

/**
 * Normalizes loader input into a loader function
 * - If string: treats as prefix and requires explicit loader
 * - If function: uses as-is
 * - If object: creates static loader
 */
export function normalizeLoader<T>(
  input: LoaderInput<T>,
  defaultMapping?: T,
): CustomEnvLoader<T> {
  // If it's a function, use it as-is
  if (typeof input === 'function') {
    return input as CustomEnvLoader<T>;
  }

  // If it's a string (prefix), create loader from default mapping
  if (typeof input === 'string') {
    if (!defaultMapping) {
      throw new Error(
        'When providing a prefix string, a default mapping must be provided',
      );
    }
    return createNestedEnvLoader(defaultMapping);
  }

  // Otherwise, treat as static config
  return createStaticLoader(input);
}
