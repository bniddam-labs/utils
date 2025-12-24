import { z } from 'zod';

/**
 * Configuration schemas using Zod
 * These schemas are the single source of truth for configuration types
 */

/**
 * Database configuration schema
 */
export const DatabaseConfigSchema = z.object({
  type: z.literal('postgres').default('postgres'),
  host: z.string(),
  port: z.number().int().positive(),
  username: z.string(),
  password: z.string(),
  database: z.string(),
  synchronize: z.boolean().default(false),
  dropSchema: z.boolean().optional(),
  logging: z.boolean().default(false),
  ssl: z.boolean().optional(),
  autoLoadEntities: z.boolean().default(true),
  migrationsRun: z.boolean().default(false),
  rlsEnabled: z.boolean().default(false),
});

/**
 * OAuth provider configuration schema
 */
export const OAuthProviderSchema = z.object({
  clientId: z.string(),
  clientSecret: z.string(),
});

/**
 * Authentication configuration schema
 */
export const AuthConfigSchema = z.object({
  jwtSecret: z.string().min(32, 'JWT secret must be at least 32 characters'),
  jwtRefreshSecret: z.string().min(32, 'JWT refresh secret must be at least 32 characters'),
  jwtExpiresIn: z.string().default('15m'),
  jwtRefreshExpiresIn: z.string().default('7d'),
  bcryptRounds: z.number().int().min(10).max(20).default(12),
  maxFailedAttempts: z.number().int().positive().default(5),
  lockoutDurationMinutes: z.number().int().positive().default(30),
  google: OAuthProviderSchema.optional(),
  github: OAuthProviderSchema.optional(),
});

/**
 * Redis cache configuration schema
 */
export const RedisConfigSchema = z.object({
  host: z.string(),
  port: z.number().int().positive(),
  password: z.string().optional(),
  db: z.number().int().nonnegative().default(0),
  ttl: z.number().int().positive().default(3600),
  keyPrefix: z.string().default('cache:'),
});

/**
 * Application configuration schema
 */
export const AppConfigSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  port: z.number().int().positive(),
  nodeEnv: z.enum(['development', 'production', 'test', 'staging']).default('development'),
  corsOrigin: z.string().default('*'),
  frontendUrl: z.string().url(),
  rateLimitMax: z.number().int().positive().default(100),
  rateLimitTtl: z.number().int().positive().default(60),
});

/**
 * Admin panel configuration schema
 */
export const AdminConfigSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12, 'Admin password must be at least 12 characters'),
  allowedIps: z.array(z.string()).optional(),
});

/**
 * Email service configuration schema
 */
export const EmailConfigSchema = z.object({
  enabled: z.boolean().default(false),
  from: z.string().email(),
  brevoApiKey: z.string().optional(),
  smtp: z
    .object({
      host: z.string(),
      port: z.number().int(),
      secure: z.boolean().default(true),
      auth: z.object({
        user: z.string(),
        pass: z.string(),
      }),
    })
    .optional(),
});

/**
 * S3-compatible storage configuration schema
 */
export const S3ConfigSchema = z.object({
  endpoint: z.string(),
  port: z.number().int().positive(),
  useSSL: z.boolean().default(true),
  region: z.string(),
  accessKey: z.string(),
  secretKey: z.string(),
  bucketName: z.string(),
});

/**
 * RabbitMQ message queue configuration schema
 */
export const RabbitMQConfigSchema = z.object({
  uri: z.string().url(),
  exchange: z.string(),
  dlxExchange: z.string(),
  connectionInitOptions: z
    .object({
      wait: z.boolean().default(true),
      timeout: z.number().int().positive().default(10000),
      reject: z.boolean().default(true),
    })
    .optional(),
});

/**
 * Logging configuration schema
 */
export const LoggingConfigSchema = z.object({
  level: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  format: z.enum(['json', 'pretty']).default('json'),
  transports: z.array(z.enum(['console', 'file'])).default(['console']),
  fileConfig: z
    .object({
      filename: z.string(),
      maxSize: z.string().default('10m'),
      maxFiles: z.number().int().default(5),
    })
    .optional(),
});

/**
 * Feature flags configuration schema
 */
export const FeatureFlagsConfigSchema = z.object({
  enableNewUI: z.boolean().default(false),
  enableBetaFeatures: z.boolean().default(false),
  enableAnalytics: z.boolean().default(true),
  maintenanceMode: z.boolean().default(false),
});

/**
 * Complete application configuration schema
 * Core sections (app, database, auth) are required
 * Optional sections can be selectively included using the builder
 */
export const ConfigurationSchema = z.object({
  app: AppConfigSchema,
  database: DatabaseConfigSchema,
  auth: AuthConfigSchema,
  redis: RedisConfigSchema.optional(),
  admin: AdminConfigSchema.optional(),
  email: EmailConfigSchema.optional(),
  s3: S3ConfigSchema.optional(),
  rabbitmq: RabbitMQConfigSchema.optional(),
  logging: LoggingConfigSchema.optional(),
  featureFlags: FeatureFlagsConfigSchema.optional(),
});
