/**
 * Utility functions for configuration management
 */

/**
 * Deep merge two objects
 * @param target - Target object
 * @param source - Source object to merge
 * @returns Merged object
 */
export function deepMerge<T = any>(target: any, source: any): T {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }

  return output;
}

/**
 * Check if a value is a plain object
 * @param item - Value to check
 * @returns True if the value is a plain object
 */
function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Mask sensitive values for safe logging
 * Redacts passwords, secrets, keys, and tokens
 * @param config - Configuration object to mask
 * @returns Configuration object with sensitive values masked
 */
export function maskSecrets(config: any): any {
  const sensitiveKeys = [
    'password',
    'secret',
    'apikey',
    'token',
    'secretkey',
    'accesskey',
    'clientsecret',
    'auth',
  ];

  const mask = (obj: any): any => {
    if (!isObject(obj)) return obj;

    const masked = { ...obj };
    Object.keys(masked).forEach((key) => {
      const lowerKey = key.toLowerCase();
      if (sensitiveKeys.some((sensitive) => lowerKey.includes(sensitive))) {
        masked[key] = '***REDACTED***';
      } else if (isObject(masked[key])) {
        masked[key] = mask(masked[key]);
      }
    });

    return masked;
  };

  return mask(config);
}

/**
 * Parse string boolean values
 * @param value - String value to parse
 * @param defaultValue - Default value if parsing fails
 * @returns Boolean value
 */
export function parseBoolean(value: string | undefined, defaultValue = false): boolean {
  if (!value) return defaultValue;
  const normalized = value.toLowerCase().trim();
  if (normalized === 'true' || normalized === '1' || normalized === 'yes') return true;
  if (normalized === 'false' || normalized === '0' || normalized === 'no') return false;
  return defaultValue;
}

/**
 * Parse string number values
 * @param value - String value to parse
 * @param defaultValue - Default value if parsing fails
 * @returns Number value
 */
export function parseNumber(value: string | undefined, defaultValue: number): number {
  if (!value) return defaultValue;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Parse comma-separated string values into array
 * @param value - String value to parse
 * @param defaultValue - Default value if parsing fails
 * @returns Array of strings
 */
export function parseArray(value: string | undefined, defaultValue: string[] = []): string[] {
  if (!value) return defaultValue;
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * Get required environment variable or throw error
 * @param key - Environment variable key
 * @param errorMessage - Custom error message
 * @returns Environment variable value
 * @throws Error if environment variable is not set
 */
export function requireEnv(key: string, errorMessage?: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(errorMessage || `Required environment variable ${key} is not set`);
  }
  return value;
}

/**
 * Get optional environment variable with default value
 * @param key - Environment variable key
 * @param defaultValue - Default value
 * @returns Environment variable value or default
 */
export function getEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

/**
 * Validate production secrets
 * Ensures critical secrets meet security requirements in production
 * @param config - Configuration object
 * @throws Error if validation fails
 */
export function validateProductionSecrets(config: any): void {
  if (config.app?.nodeEnv !== 'production') {
    return; // Only validate in production
  }

  // JWT secrets validation
  if (!config.auth?.jwtSecret || config.auth.jwtSecret.length < 32) {
    throw new Error(
      'SECURITY ERROR: JWT_SECRET must be set with at least 32 characters in production',
    );
  }

  if (!config.auth?.jwtRefreshSecret || config.auth.jwtRefreshSecret.length < 32) {
    throw new Error(
      'SECURITY ERROR: JWT_REFRESH_SECRET must be set with at least 32 characters in production',
    );
  }

  // Admin password validation
  if (
    !config.admin?.password ||
    config.admin.password === 'change-me-in-production' ||
    config.admin.password.length < 12
  ) {
    throw new Error(
      'SECURITY ERROR: ADMIN_PASSWORD must be set to a strong password (at least 12 characters) in production',
    );
  }

  // Database password validation
  if (!config.database?.password || config.database.password === 'postgres') {
    throw new Error(
      'SECURITY ERROR: DATABASE_PASSWORD must be set to a strong password in production',
    );
  }
}
