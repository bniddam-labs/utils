/**
 * Configuration module - provides type-safe configuration helpers
 *
 * This module exports HELPERS ONLY - no fixed configuration values.
 * Consuming projects should use these utilities to build their own config.
 *
 * @example
 * ```typescript
 * // In your consuming project
 * import { createConfigBuilder, validateConfig } from '@bniddam-labs/utils/config';
 *
 * const config = createConfigBuilder()
 *   .fromEnv()
 *   .override({ logging: { level: 'debug' } })
 *   .build();
 * ```
 */

// Schemas (source of truth)
export * from './schema.js';

// Types (derived from schemas)
export * from './types.js';

// Builder (fluent configuration builder)
export {
  ConfigBuilder,
  createConfigBuilder,
  createConfigFromDotEnv,
  createConfigFromEnv,
  createConfigFromPreset,
  createTestConfig,
} from './builder.js';

// Loaders (environment, file, test)
export {
  loadDotEnv,
  loadFromEnv,
  loadFromFile,
  loadTestConfig,
  // Individual section loaders
  loadAppFromEnv,
  loadDatabaseFromEnv,
  loadAuthFromEnv,
  loadRedisFromEnv,
  loadAdminFromEnv,
  loadEmailFromEnv,
  loadS3FromEnv,
  loadRabbitMQFromEnv,
  loadLoggingFromEnv,
  loadFeatureFlagsFromEnv,
} from './loaders.js';

// Validators (validation and logging helpers)
export {
  validateConfig,
  safeValidateConfig,
  validatePartialConfig,
  logConfigSafely,
  getConfigSummary,
} from './validators.js';

// Utils (deep merge, secret masking, parsing)
export {
  deepMerge,
  maskSecrets,
  parseBoolean,
  parseNumber,
  parseArray,
  requireEnv,
  getEnv,
  validateProductionSecrets,
} from './utils.js';

// Defaults (optional presets - NOT auto-applied)
export {
  DEVELOPMENT_PRESET,
  PRODUCTION_PRESET,
  STAGING_PRESET,
  TEST_PRESET,
  getPreset,
  DEFAULT_DATABASE_CONFIG,
  DEFAULT_REDIS_CONFIG,
  DEFAULT_JWT_CONFIG,
  DEFAULT_RATE_LIMIT,
  DEFAULT_LOGGING_CONFIG,
} from './defaults.js';

// Custom configuration helpers
export {
  createSimpleEnvLoader,
  createNestedEnvLoader,
  createStaticLoader,
  normalizeLoader,
  toEnvVarName,
  loadEnvValue,
  type CustomEnvLoader,
  type LoaderInput,
} from './custom.js';
