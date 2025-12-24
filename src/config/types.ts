import type { z } from 'zod';
import type {
  AdminConfigSchema,
  AppConfigSchema,
  AuthConfigSchema,
  ConfigurationSchema,
  DatabaseConfigSchema,
  EmailConfigSchema,
  FeatureFlagsConfigSchema,
  LoggingConfigSchema,
  OAuthProviderSchema,
  RabbitMQConfigSchema,
  RedisConfigSchema,
  S3ConfigSchema,
} from './schema.js';

/**
 * Configuration types derived from Zod schemas
 * DO NOT manually define interfaces - types are inferred from schemas
 */

export type DatabaseConfig = z.infer<typeof DatabaseConfigSchema>;
export type OAuthProvider = z.infer<typeof OAuthProviderSchema>;
export type AuthConfig = z.infer<typeof AuthConfigSchema>;
export type RedisConfig = z.infer<typeof RedisConfigSchema>;
export type AppConfig = z.infer<typeof AppConfigSchema>;
export type AdminConfig = z.infer<typeof AdminConfigSchema>;
export type EmailConfig = z.infer<typeof EmailConfigSchema>;
export type S3Config = z.infer<typeof S3ConfigSchema>;
export type RabbitMQConfig = z.infer<typeof RabbitMQConfigSchema>;
export type LoggingConfig = z.infer<typeof LoggingConfigSchema>;
export type FeatureFlagsConfig = z.infer<typeof FeatureFlagsConfigSchema>;

/**
 * Complete application configuration type
 */
export type Configuration = z.infer<typeof ConfigurationSchema>;

/**
 * Deep partial helper type
 */
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Partial configuration for builder pattern
 */
export type PartialConfiguration = DeepPartial<Configuration>;
