import * as dotenv from 'dotenv';
import * as fs from 'node:fs';
import * as path from 'node:path';
import type { PartialConfiguration } from './types.js';
import { getEnv, parseArray, parseBoolean, parseNumber } from './utils.js';

/**
 * Configuration loaders - functions to load configuration from various sources
 * These are helpers that DON'T create fixed config, but provide utilities
 * for consuming projects to use when building their config
 */

/**
 * Load .env file into process.env
 * @param envFilePath - Path to .env file (defaults to .env in current directory)
 * @param override - Whether to override existing environment variables
 */
export function loadDotEnv(envFilePath = '.env', override = false): void {
  const resolvedPath = path.resolve(process.cwd(), envFilePath);

  if (fs.existsSync(resolvedPath)) {
    dotenv.config({ path: resolvedPath, override });
  }
}

/**
 * Helper to create prefixed environment variable key
 */
const prefixKey = (prefix: string, key: string) => `${prefix}${key}`;

/**
 * Load app configuration from environment variables
 * @param prefix - Optional prefix for environment variables
 */
export function loadAppFromEnv(prefix = '') {
  return {
    name: getEnv(prefixKey(prefix, 'APP_NAME'), 'NestJS Boilerplate'),
    url: getEnv(prefixKey(prefix, 'APP_URL'), 'http://localhost:3000'),
    frontendUrl: getEnv(prefixKey(prefix, 'FRONTEND_URL'), 'http://localhost:3001'),
    port: parseNumber(process.env[prefixKey(prefix, 'PORT')], 3000),
    nodeEnv: (process.env[prefixKey(prefix, 'NODE_ENV')] || 'development') as any,
    corsOrigin: getEnv(prefixKey(prefix, 'CORS_ORIGIN'), '*'),
    rateLimitMax: parseNumber(process.env[prefixKey(prefix, 'RATE_LIMIT_MAX')], 100),
    rateLimitTtl: parseNumber(process.env[prefixKey(prefix, 'RATE_LIMIT_TTL')], 60),
  };
}

/**
 * Load database configuration from environment variables
 * @param prefix - Optional prefix for environment variables
 */
export function loadDatabaseFromEnv(prefix = '') {
  return {
    type: 'postgres' as const,
    host: getEnv(prefixKey(prefix, 'DATABASE_HOST'), 'localhost'),
    port: parseNumber(process.env[prefixKey(prefix, 'DATABASE_PORT')], 5432),
    username: getEnv(prefixKey(prefix, 'DATABASE_USERNAME'), 'postgres'),
    password: getEnv(prefixKey(prefix, 'DATABASE_PASSWORD'), 'postgres'),
    database: getEnv(prefixKey(prefix, 'DATABASE_NAME'), 'nestjs_boilerplate'),
    synchronize: !parseBoolean(process.env[prefixKey(prefix, 'USE_MIGRATIONS')], false),
    dropSchema: parseBoolean(process.env[prefixKey(prefix, 'DATABASE_DROP_SCHEMA')], false),
    logging: parseBoolean(process.env[prefixKey(prefix, 'DATABASE_LOGGING')], false),
    ssl: parseBoolean(process.env[prefixKey(prefix, 'DATABASE_SSL')], false),
    autoLoadEntities: true,
    migrationsRun: parseBoolean(process.env[prefixKey(prefix, 'USE_MIGRATIONS')], false),
    rlsEnabled: parseBoolean(process.env[prefixKey(prefix, 'RLS_ENABLED')], false),
  };
}

/**
 * Load authentication configuration from environment variables
 * @param prefix - Optional prefix for environment variables
 */
export function loadAuthFromEnv(prefix = '') {
  return {
    jwtSecret: getEnv(prefixKey(prefix, 'JWT_SECRET'), 'jwt-secret-key-DEVELOPMENT-ONLY'),
    jwtRefreshSecret: getEnv(
      prefixKey(prefix, 'JWT_REFRESH_SECRET'),
      'jwt-refresh-secret-key-DEVELOPMENT-ONLY',
    ),
    jwtExpiresIn: getEnv(prefixKey(prefix, 'JWT_EXPIRES_IN'), '15m'),
    jwtRefreshExpiresIn: getEnv(prefixKey(prefix, 'JWT_REFRESH_EXPIRES_IN'), '7d'),
    bcryptRounds: parseNumber(process.env[prefixKey(prefix, 'BCRYPT_ROUNDS')], 12),
    maxFailedAttempts: parseNumber(process.env[prefixKey(prefix, 'AUTH_MAX_FAILED_ATTEMPTS')], 5),
    lockoutDurationMinutes: parseNumber(
      process.env[prefixKey(prefix, 'AUTH_LOCKOUT_DURATION_MINUTES')],
      30,
    ),
    ...(process.env[prefixKey(prefix, 'GOOGLE_CLIENT_ID')] &&
    process.env[prefixKey(prefix, 'GOOGLE_CLIENT_SECRET')]
      ? {
          google: {
            clientId: process.env[prefixKey(prefix, 'GOOGLE_CLIENT_ID')] as string,
            clientSecret: process.env[prefixKey(prefix, 'GOOGLE_CLIENT_SECRET')] as string,
          },
        }
      : {}),
    ...(process.env[prefixKey(prefix, 'GITHUB_CLIENT_ID')] &&
    process.env[prefixKey(prefix, 'GITHUB_CLIENT_SECRET')]
      ? {
          github: {
            clientId: process.env[prefixKey(prefix, 'GITHUB_CLIENT_ID')] as string,
            clientSecret: process.env[prefixKey(prefix, 'GITHUB_CLIENT_SECRET')] as string,
          },
        }
      : {}),
  };
}

/**
 * Load Redis configuration from environment variables
 * @param prefix - Optional prefix for environment variables
 */
export function loadRedisFromEnv(prefix = '') {
  return {
    host: getEnv(prefixKey(prefix, 'REDIS_HOST'), 'localhost'),
    port: parseNumber(process.env[prefixKey(prefix, 'REDIS_PORT')], 6379),
    password: process.env[prefixKey(prefix, 'REDIS_PASSWORD')],
    db: parseNumber(process.env[prefixKey(prefix, 'REDIS_DB')], 0),
    ttl: parseNumber(process.env[prefixKey(prefix, 'CACHE_TTL')], 3600),
    keyPrefix: getEnv(prefixKey(prefix, 'REDIS_KEY_PREFIX'), 'cache:'),
  };
}

/**
 * Load admin configuration from environment variables
 * @param prefix - Optional prefix for environment variables
 */
export function loadAdminFromEnv(prefix = '') {
  return {
    email: getEnv(prefixKey(prefix, 'ADMIN_EMAIL'), 'admin@example.com'),
    password: getEnv(prefixKey(prefix, 'ADMIN_PASSWORD'), 'change-me-in-production'),
    allowedIps: process.env[prefixKey(prefix, 'ADMIN_ALLOWED_IPS')]
      ? parseArray(process.env[prefixKey(prefix, 'ADMIN_ALLOWED_IPS')])
      : undefined,
  };
}

/**
 * Load email configuration from environment variables
 * @param prefix - Optional prefix for environment variables
 */
export function loadEmailFromEnv(prefix = '') {
  return {
    enabled: process.env[prefixKey(prefix, 'EMAIL_STATUS')] === 'enabled',
    from: getEnv(prefixKey(prefix, 'EMAIL_FROM'), 'noreply@example.com'),
    brevoApiKey: process.env[prefixKey(prefix, 'BREVO_API_KEY')],
    ...(process.env[prefixKey(prefix, 'SMTP_HOST')]
      ? {
          smtp: {
            host: process.env[prefixKey(prefix, 'SMTP_HOST')] as string,
            port: parseNumber(process.env[prefixKey(prefix, 'SMTP_PORT')], 587),
            secure: parseBoolean(process.env[prefixKey(prefix, 'SMTP_SECURE')], true),
            auth: {
              user: getEnv(prefixKey(prefix, 'SMTP_USER'), ''),
              pass: getEnv(prefixKey(prefix, 'SMTP_PASS'), ''),
            },
          },
        }
      : {}),
  };
}

/**
 * Load S3 configuration from environment variables
 * @param prefix - Optional prefix for environment variables
 */
export function loadS3FromEnv(prefix = '') {
  return {
    endpoint: getEnv(prefixKey(prefix, 'S3_ENDPOINT'), 's3.amazonaws.com'),
    port: parseNumber(process.env[prefixKey(prefix, 'S3_PORT')], 443),
    useSSL: parseBoolean(process.env[prefixKey(prefix, 'S3_USE_SSL')], true),
    region: getEnv(prefixKey(prefix, 'S3_REGION'), 'eu-west-3'),
    accessKey: getEnv(prefixKey(prefix, 'S3_ACCESS_KEY'), ''),
    secretKey: getEnv(prefixKey(prefix, 'S3_SECRET_KEY'), ''),
    bucketName: getEnv(prefixKey(prefix, 'S3_BUCKET_NAME'), 'nestjs-boilerplate-files'),
  };
}

/**
 * Load RabbitMQ configuration from environment variables
 * @param prefix - Optional prefix for environment variables
 */
export function loadRabbitMQFromEnv(prefix = '') {
  return {
    uri:
      process.env[prefixKey(prefix, 'RABBITMQ_URI')] ||
      `amqp://${getEnv(prefixKey(prefix, 'RABBITMQ_USER'), 'guest')}:${getEnv(prefixKey(prefix, 'RABBITMQ_PASSWORD'), 'guest')}@${getEnv(prefixKey(prefix, 'RABBITMQ_HOST'), 'localhost')}:${getEnv(prefixKey(prefix, 'RABBITMQ_PORT'), '5672')}${
        process.env[prefixKey(prefix, 'RABBITMQ_VHOST')] &&
        process.env[prefixKey(prefix, 'RABBITMQ_VHOST')] !== '/'
          ? `/${process.env[prefixKey(prefix, 'RABBITMQ_VHOST')]}`
          : ''
      }`,
    exchange: getEnv(prefixKey(prefix, 'RABBITMQ_EXCHANGE'), 'app.notifications'),
    dlxExchange: getEnv(prefixKey(prefix, 'RABBITMQ_DLX_EXCHANGE'), 'app.notifications.dlx'),
    connectionInitOptions: {
      wait: process.env[prefixKey(prefix, 'NODE_ENV')] !== 'test',
      timeout: 10000,
      reject: true,
    },
  };
}

/**
 * Load logging configuration from environment variables
 * @param prefix - Optional prefix for environment variables
 */
export function loadLoggingFromEnv(prefix = '') {
  return {
    level: (getEnv(prefixKey(prefix, 'LOG_LEVEL'), 'info') as any) || 'info',
    format: (getEnv(prefixKey(prefix, 'LOG_FORMAT'), 'json') as any) || 'json',
    transports: parseArray(process.env[prefixKey(prefix, 'LOG_TRANSPORTS')], ['console']) as any,
    ...(process.env[prefixKey(prefix, 'LOG_FILE')]
      ? {
          fileConfig: {
            filename: process.env[prefixKey(prefix, 'LOG_FILE')] as string,
            maxSize: getEnv(prefixKey(prefix, 'LOG_MAX_SIZE'), '10m'),
            maxFiles: parseNumber(process.env[prefixKey(prefix, 'LOG_MAX_FILES')], 5),
          },
        }
      : {}),
  };
}

/**
 * Load feature flags configuration from environment variables
 * @param prefix - Optional prefix for environment variables
 */
export function loadFeatureFlagsFromEnv(prefix = '') {
  return {
    enableNewUI: parseBoolean(process.env[prefixKey(prefix, 'FEATURE_NEW_UI')], false),
    enableBetaFeatures: parseBoolean(process.env[prefixKey(prefix, 'FEATURE_BETA')], false),
    enableAnalytics: parseBoolean(process.env[prefixKey(prefix, 'FEATURE_ANALYTICS')], true),
    maintenanceMode: parseBoolean(process.env[prefixKey(prefix, 'MAINTENANCE_MODE')], false),
  };
}

/**
 * Load configuration from environment variables (all sections)
 * @param prefix - Optional prefix for environment variables (e.g., 'APP_')
 * @returns Partial configuration loaded from environment
 */
export function loadFromEnv(prefix = ''): PartialConfiguration {
  return {
    app: loadAppFromEnv(prefix),
    database: loadDatabaseFromEnv(prefix),
    auth: loadAuthFromEnv(prefix),
    redis: loadRedisFromEnv(prefix),
    admin: loadAdminFromEnv(prefix),
    email: loadEmailFromEnv(prefix),
    s3: loadS3FromEnv(prefix),
    rabbitmq: loadRabbitMQFromEnv(prefix),
    logging: loadLoggingFromEnv(prefix),
    featureFlags: loadFeatureFlagsFromEnv(prefix),
  };
}

/**
 * Load configuration from a JSON file
 * @param filePath - Path to JSON config file
 * @returns Partial configuration loaded from file
 */
export function loadFromFile(filePath: string): PartialConfiguration {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fileContent = require(filePath);
    return fileContent as PartialConfiguration;
  } catch (error) {
    throw new Error(`Failed to load configuration from file ${filePath}: ${error}`);
  }
}

/**
 * Load minimal configuration for testing
 * @returns Minimal configuration for test environment
 */
export function loadTestConfig(): PartialConfiguration {
  return {
    app: {
      name: 'Test App',
      url: 'http://localhost:3000',
      frontendUrl: 'http://localhost:3001',
      port: 3000,
      nodeEnv: 'test',
      corsOrigin: '*',
      rateLimitMax: 1000,
      rateLimitTtl: 60,
    },
    database: {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'test',
      password: 'test',
      database: 'test_db',
      synchronize: true,
      dropSchema: true,
      logging: false,
      autoLoadEntities: true,
      migrationsRun: false,
      rlsEnabled: false,
    },
    auth: {
      jwtSecret: 'test-jwt-secret-32-characters-long-for-testing',
      jwtRefreshSecret: 'test-refresh-secret-32-characters-long-for-testing',
      jwtExpiresIn: '15m',
      jwtRefreshExpiresIn: '7d',
      bcryptRounds: 10,
      maxFailedAttempts: 5,
      lockoutDurationMinutes: 30,
    },
    redis: {
      host: 'localhost',
      port: 6379,
      db: 1,
      ttl: 3600,
      keyPrefix: 'test:',
    },
    admin: {
      email: 'admin@test.com',
      password: 'test-admin-password-secure',
    },
    email: {
      enabled: false,
      from: 'test@example.com',
    },
    s3: {
      endpoint: 's3.amazonaws.com',
      port: 443,
      useSSL: true,
      region: 'eu-west-3',
      accessKey: 'test-access-key',
      secretKey: 'test-secret-key',
      bucketName: 'test-bucket',
    },
    rabbitmq: {
      uri: 'amqp://guest:guest@localhost:5672',
      exchange: 'test.exchange',
      dlxExchange: 'test.exchange.dlx',
      connectionInitOptions: {
        wait: false,
        timeout: 10000,
        reject: true,
      },
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
}
