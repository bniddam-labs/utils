import type { PartialConfiguration } from './types.js';

/**
 * Default/preset configurations
 * These are OPTIONAL reference configurations that consuming projects can use
 * They are NOT automatically applied - projects must explicitly use them
 */

/**
 * Development environment preset
 * Optimized for local development with verbose logging and auto-sync
 */
export const DEVELOPMENT_PRESET: PartialConfiguration = {
  app: {
    nodeEnv: 'development',
    corsOrigin: '*',
    rateLimitMax: 1000,
    rateLimitTtl: 60,
  },
  database: {
    synchronize: true,
    dropSchema: false, // Don't drop schema by default, let user decide
    logging: true,
    ssl: false,
    migrationsRun: false,
    rlsEnabled: false,
  },
  logging: {
    level: 'debug',
    format: 'pretty',
    transports: ['console'],
  },
  featureFlags: {
    enableNewUI: true,
    enableBetaFeatures: true,
    enableAnalytics: false,
    maintenanceMode: false,
  },
};

/**
 * Production environment preset
 * Optimized for production with security and performance
 */
export const PRODUCTION_PRESET: PartialConfiguration = {
  app: {
    nodeEnv: 'production',
    corsOrigin: '', // Should be overridden with specific domains
    rateLimitMax: 100,
    rateLimitTtl: 60,
  },
  database: {
    synchronize: false, // Never auto-sync in production
    dropSchema: false,
    logging: false,
    ssl: true,
    migrationsRun: true,
    rlsEnabled: true,
  },
  logging: {
    level: 'info',
    format: 'json',
    transports: ['console', 'file'],
  },
  featureFlags: {
    enableNewUI: false,
    enableBetaFeatures: false,
    enableAnalytics: true,
    maintenanceMode: false,
  },
};

/**
 * Staging environment preset
 * Similar to production but with more debugging enabled
 */
export const STAGING_PRESET: PartialConfiguration = {
  app: {
    nodeEnv: 'staging',
    corsOrigin: '*',
    rateLimitMax: 200,
    rateLimitTtl: 60,
  },
  database: {
    synchronize: false,
    dropSchema: false,
    logging: true,
    ssl: true,
    migrationsRun: true,
    rlsEnabled: true,
  },
  logging: {
    level: 'debug',
    format: 'json',
    transports: ['console'],
  },
  featureFlags: {
    enableNewUI: true,
    enableBetaFeatures: true,
    enableAnalytics: true,
    maintenanceMode: false,
  },
};

/**
 * Test environment preset
 * Optimized for running tests with fast setup and teardown
 */
export const TEST_PRESET: PartialConfiguration = {
  app: {
    nodeEnv: 'test',
    corsOrigin: '*',
    rateLimitMax: 10000,
    rateLimitTtl: 60,
  },
  database: {
    synchronize: true,
    dropSchema: true,
    logging: false,
    ssl: false,
    migrationsRun: false,
    rlsEnabled: false,
  },
  logging: {
    level: 'error',
    format: 'json',
    transports: ['console'],
  },
  featureFlags: {
    enableNewUI: false,
    enableBetaFeatures: false,
    enableAnalytics: false,
    maintenanceMode: false,
  },
};

/**
 * Get preset configuration by name
 * @param preset - Preset name
 * @returns Partial configuration for the preset
 */
export function getPreset(
  preset: 'development' | 'production' | 'staging' | 'test',
): PartialConfiguration {
  switch (preset) {
    case 'development':
      return DEVELOPMENT_PRESET;
    case 'production':
      return PRODUCTION_PRESET;
    case 'staging':
      return STAGING_PRESET;
    case 'test':
      return TEST_PRESET;
    default:
      throw new Error(`Unknown preset: ${preset}`);
  }
}

/**
 * Default database configuration values (for reference)
 */
export const DEFAULT_DATABASE_CONFIG = {
  type: 'postgres' as const,
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'app',
  synchronize: false,
  logging: false,
  autoLoadEntities: true,
  migrationsRun: false,
  rlsEnabled: false,
};

/**
 * Default Redis configuration values (for reference)
 */
export const DEFAULT_REDIS_CONFIG = {
  host: 'localhost',
  port: 6379,
  db: 0,
  ttl: 3600,
  keyPrefix: 'cache:',
};

/**
 * Default JWT configuration values (for reference)
 */
export const DEFAULT_JWT_CONFIG = {
  jwtExpiresIn: '15m',
  jwtRefreshExpiresIn: '7d',
  bcryptRounds: 12,
  maxFailedAttempts: 5,
  lockoutDurationMinutes: 30,
};

/**
 * Default rate limiting configuration (for reference)
 */
export const DEFAULT_RATE_LIMIT = {
  max: 100,
  ttl: 60,
};

/**
 * Default logging configuration (for reference)
 */
export const DEFAULT_LOGGING_CONFIG = {
  level: 'info' as const,
  format: 'json' as const,
  transports: ['console'] as const,
};
