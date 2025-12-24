# Configuration Package

This package provides **configuration helpers only** - no fixed configuration values.
Consuming projects use these utilities to build their own configuration.

## Key Features

- ✅ **Zod schemas as single source of truth** - Types are inferred, no duplication
- ✅ **Fluent builder API** - Chainable, type-safe configuration building
- ✅ **Environment presets** - Optional development/production/staging/test presets
- ✅ **Deep merge support** - Combine configs from multiple sources
- ✅ **Production validation** - Security checks for critical secrets
- ✅ **Secret masking** - Safe logging with automatic secret redaction

## Usage in Consuming Projects

### Selective Loading (Recommended)

Load only the configuration sections you need:

```typescript
// config/app.config.ts (in your project, NOT in @bniddam-labs/utils)
import { createConfigBuilder } from '@bniddam-labs/utils/config';

// Only load app, database, and S3 - no Redis, RabbitMQ, etc.
export const appConfig = createConfigBuilder()
  .fromDotEnv()     // Load .env file
  .app()            // Enable and load app section
  .database()       // Enable and load database section
  .s3()             // Enable and load S3 section
  .build();

// Result: { app: {...}, database: {...}, s3: {...} }
// Redis, RabbitMQ, Email, Admin sections are NOT included
```

### Load All Sections (Backward Compatible)

```typescript
// Load all predefined sections at once
import { createConfigBuilder } from '@bniddam-labs/utils/config';

export const appConfig = createConfigBuilder()
  .fromEnv()
  .build();
```

### With Preset and Overrides

```typescript
import { createConfigBuilder } from '@bniddam-labs/utils/config';

export const appConfig = createConfigBuilder()
  .preset('production')
  .fromEnv()
  .override({
    logging: { level: 'debug' },
    database: { host: process.env.CUSTOM_DB_HOST }
  })
  .build();
```

### Adding Custom Configuration Sections

Extend the configuration with your own custom sections:

```typescript
import { z } from 'zod';
import {
  createConfigBuilder,
  createNestedEnvLoader,
  type AppConfig,
  type DatabaseConfig
} from '@bniddam-labs/utils/config';

// Define your custom service schema
const CustomServiceSchema = z.object({
  url: z.string().url(),
  apiKey: z.string(),
  timeout: z.number().default(5000),
  credentials: z.object({
    username: z.string(),
    password: z.string()
  })
});

// Create a loader that reads from environment variables
const customServiceLoader = createNestedEnvLoader({
  url: 'http://localhost:3000',
  apiKey: '',
  timeout: 5000,
  credentials: {
    username: 'admin',
    password: 'secret'
  }
});

// Define the complete config type (for TypeScript)
type MyAppConfig = {
  app: AppConfig;
  database: DatabaseConfig;
  customService: z.infer<typeof CustomServiceSchema>;
};

// Build config with custom section
export const appConfig = createConfigBuilder()
  .fromDotEnv()
  .app()
  .database()
  .addCustom('customService', CustomServiceSchema, customServiceLoader)
  .build<MyAppConfig>();

// Now TypeScript knows about all sections including custom ones!
console.log(appConfig.customService.url); // ✅ TypeScript autocomplete works
console.log(appConfig.customService.credentials.username); // ✅ Fully type-safe

// Environment variables read:
// - CUSTOM_SERVICE_URL
// - CUSTOM_SERVICE_API_KEY
// - CUSTOM_SERVICE_TIMEOUT
// - CUSTOM_SERVICE_CREDENTIALS_USERNAME
// - CUSTOM_SERVICE_CREDENTIALS_PASSWORD
```

### Custom Configuration with Static Values

```typescript
import { z } from 'zod';
import { createConfigBuilder } from '@bniddam-labs/utils/config';

const CustomServiceSchema = z.object({
  url: z.string().url(),
  apiKey: z.string(),
});

export const appConfig = createConfigBuilder()
  .fromDotEnv()
  .app()
  .database()
  .addCustom('customService', CustomServiceSchema, {
    url: 'https://api.example.com',
    apiKey: process.env.MY_CUSTOM_API_KEY || '',
  })
  .build();
```

### Full Custom Configuration (No Core Sections)

You can create a completely custom configuration without using any of the predefined core sections:

```typescript
import { z } from 'zod';
import { createConfigBuilder, createNestedEnvLoader } from '@bniddam-labs/utils/config';

// Define your complete custom schema
const MyCompleteConfigSchema = z.object({
  api: z.object({
    url: z.string().url(),
    key: z.string(),
    timeout: z.number().default(5000)
  }),
  database: z.object({
    host: z.string(),
    port: z.number(),
    name: z.string()
  }),
  services: z.object({
    payment: z.object({
      provider: z.string(),
      credentials: z.object({
        apiKey: z.string(),
        secret: z.string()
      })
    }),
    email: z.object({
      from: z.string().email(),
      smtpHost: z.string()
    })
  }),
  features: z.object({
    enableAnalytics: z.boolean().default(true),
    enableBeta: z.boolean().default(false)
  })
});

// Create loader with default values
const myConfigLoader = createNestedEnvLoader({
  api: {
    url: 'http://localhost:3000',
    key: '',
    timeout: 5000
  },
  database: {
    host: 'localhost',
    port: 5432,
    name: 'mydb'
  },
  services: {
    payment: {
      provider: 'stripe',
      credentials: {
        apiKey: '',
        secret: ''
      }
    },
    email: {
      from: 'noreply@example.com',
      smtpHost: 'localhost'
    }
  },
  features: {
    enableAnalytics: true,
    enableBeta: false
  }
});

// Define the type for your config
type MyCompleteConfig = {
  app: z.infer<typeof MyCompleteConfigSchema>;
};

// Build config with ONLY your custom section
export const appConfig = createConfigBuilder()
  .fromDotEnv()
  .addCustom('app', MyCompleteConfigSchema, myConfigLoader)
  .build<MyCompleteConfig>();

// Result: { app: { api: {...}, database: {...}, services: {...}, features: {...} } }
// NO core sections (redis, rabbitmq, etc.) - completely custom!

// TypeScript knows about your custom structure:
console.log(appConfig.app.api.url); // ✅ Type-safe
console.log(appConfig.app.services.payment.credentials.apiKey); // ✅ Full autocomplete
```

**Environment variables read:**
```
MY_APP_API_URL
MY_APP_API_KEY
MY_APP_API_TIMEOUT
MY_APP_DATABASE_HOST
MY_APP_DATABASE_PORT
MY_APP_DATABASE_NAME
MY_APP_SERVICES_PAYMENT_PROVIDER
MY_APP_SERVICES_PAYMENT_CREDENTIALS_API_KEY
MY_APP_SERVICES_PAYMENT_CREDENTIALS_SECRET
MY_APP_SERVICES_EMAIL_FROM
MY_APP_SERVICES_EMAIL_SMTP_HOST
MY_APP_FEATURES_ENABLE_ANALYTICS
MY_APP_FEATURES_ENABLE_BETA
```

### Multiple Custom Sections

Split your configuration into multiple custom sections:

```typescript
const ApiConfigSchema = z.object({
  url: z.string().url(),
  key: z.string()
});

const PaymentConfigSchema = z.object({
  provider: z.string(),
  apiKey: z.string()
});

const config = createConfigBuilder()
  .fromDotEnv()
  .addCustom('api', ApiConfigSchema, createNestedEnvLoader({
    url: 'http://localhost:3000',
    key: ''
  }))
  .addCustom('payment', PaymentConfigSchema, createNestedEnvLoader({
    provider: 'stripe',
    apiKey: ''
  }))
  .build();

// Result: { api: {...}, payment: {...} }
// Reads: API_URL, API_KEY, PAYMENT_PROVIDER, PAYMENT_API_KEY
```

### Advanced Builder Usage

```typescript
import { createConfigBuilder } from '@bniddam-labs/utils/config';

const isDevelopment = process.env.NODE_ENV === 'development';

export const appConfig = createConfigBuilder()
  .fromDotEnv()
  .app()
  .database({
    host: 'prod-db.example.com',
    port: 5432,
    ssl: true,
  })
  .redis({
    host: 'cache.example.com',
    ttl: 7200,
  })
  .when(isDevelopment, (builder) =>
    builder.logging({ level: 'debug', format: 'pretty' })
  )
  .build();
```

### Quick Helpers

```typescript
// Simple config from environment
import { createConfigFromEnv } from '@bniddam-labs/utils/config';
const config = createConfigFromEnv();

// Config from preset with overrides
import { createConfigFromPreset } from '@bniddam-labs/utils/config';
const config = createConfigFromPreset('production', {
  app: { port: 4000 }
});

// Test configuration
import { createTestConfig } from '@bniddam-labs/utils/config';
const testConfig = createTestConfig();
```

## Builder API

### Configuration Sections

Each section method can be called in two ways:
1. **Without arguments** - Loads from environment variables automatically
2. **With config object** - Overrides with provided values

- `.app(config?)` - Application settings (name, port, cors, etc.)
- `.database(config?)` - Database connection settings
- `.auth(config?)` - Authentication (JWT, OAuth, bcrypt)
- `.redis(config?)` - Redis cache settings
- `.admin(config?)` - Admin panel configuration
- `.email(config?)` - Email service settings
- `.s3(config?)` - S3 storage configuration
- `.rabbitmq(config?)` - RabbitMQ settings
- `.logging(config?)` - Logging configuration
- `.featureFlags(config?)` - Feature toggles
- `.addCustom(name, schema, loaderOrConfig?)` - Add custom configuration section

**Examples:**
```typescript
// Auto-load from environment
.app()

// Override with custom values
.app({ port: 4000, name: 'My App' })

// Add custom section
.addCustom('myService', schema, loader)
```

### Loading Methods

- `.fromDotEnv(envFilePath?, prefix?, override?)` - Load .env file into process.env (doesn't load sections)
- `.fromEnv(prefix?)` - Load ALL sections from environment variables (backward compatible)
- `.fromFile(path)` - Load from JSON file
- `.fromTest()` - Load test preset
- `.preset(name)` - Use environment preset (dev/prod/staging/test)
- `.merge(config)` - Merge with partial config
- `.override(config)` - Override specific values

**Note:** For selective loading, use `.fromDotEnv()` followed by individual section methods (`.app()`, `.database()`, etc.). For loading all sections at once (backward compatible), use `.fromEnv()`.

### Shortcuts

- `.forDevelopment()` - Apply development preset
- `.forProduction()` - Apply production preset
- `.forTest()` - Apply test preset
- `.forStaging()` - Apply staging preset

### Conditional Methods

- `.when(condition, fn)` - Conditionally apply configuration
- `.whenEnv(env, fn)` - Apply if environment matches

### Build Methods

- `.build()` - Validate and return final config (throws on error)
- `.buildUnsafe()` - Return config without validation
- `.peek()` - Inspect current state without building

### Utilities

- `.clone()` - Clone builder state
- `.reset()` - Reset to empty state

## Validation and Logging

```typescript
import {
  validateConfig,
  safeValidateConfig,
  logConfigSafely,
  getConfigSummary
} from '@bniddam-labs/utils/config';

// Validate config (throws on error)
const validated = validateConfig(myConfig);

// Safe validation (returns result object)
const result = safeValidateConfig(myConfig);
if (result.success) {
  console.log('Config is valid:', result.data);
} else {
  console.error('Validation errors:', result.errors);
}

// Log config safely (secrets masked)
logConfigSafely(config);

// Get safe summary for logging
const summary = getConfigSummary(config);
console.log('App started:', summary);
```

## Presets

Available presets: `development`, `production`, `staging`, `test`

```typescript
import { DEVELOPMENT_PRESET, PRODUCTION_PRESET } from '@bniddam-labs/utils/config';

// Use directly
const config = createConfigBuilder()
  .merge(PRODUCTION_PRESET)
  .fromEnv()
  .build();

// Or use preset() method
const config = createConfigBuilder()
  .preset('production')
  .fromEnv()
  .build();
```

## Environment Variables

**IMPORTANT**: Environment variable names are **case-sensitive** and **must match exactly** as shown below. The `loadFromEnv()` function expects these specific names and cannot be customized without modifying the config loader.

See `.env.example` in the project root for a complete template with detailed comments, types, and default values.

### Quick Reference

#### Application
- `APP_NAME` - Application name (string, default: "NestJS Boilerplate")
- `APP_URL` - Backend URL (string, default: "http://localhost:3000")
- `FRONTEND_URL` - Frontend URL (string, default: "http://localhost:3001")
- `PORT` - Server port (number, default: 3000)
- `NODE_ENV` - Environment (string, default: "development")
- `CORS_ORIGIN` - CORS origins (string, default: "*")
- `RATE_LIMIT_MAX` - Max requests per window (number, default: 100)
- `RATE_LIMIT_TTL` - Rate limit window in seconds (number, default: 60)

#### Database
- `DATABASE_HOST` - Database host (string, default: "localhost")
- `DATABASE_PORT` - Database port (number, default: 5432)
- `DATABASE_USERNAME` - Database user (string, default: "postgres")
- `DATABASE_PASSWORD` - Database password (string, default: "postgres")
- `DATABASE_NAME` - Database name (string, default: "nestjs_boilerplate")
- `DATABASE_SSL` - Enable SSL (boolean, default: false)
- `DATABASE_LOGGING` - Enable SQL logging (boolean, default: false)
- `USE_MIGRATIONS` - Use migrations (boolean, default: false) - When true: synchronize=false, migrationsRun=true
- `DATABASE_DROP_SCHEMA` - Drop schema on startup (boolean, default: false) **WARNING: Deletes all data!**
- `RLS_ENABLED` - Enable Row-Level Security (boolean, default: false)

#### Authentication
- `JWT_SECRET` - JWT secret key (string, **required in production**, min 32 chars)
- `JWT_REFRESH_SECRET` - JWT refresh secret (string, **required in production**, min 32 chars)
- `JWT_EXPIRES_IN` - Token expiration (string, default: "15m")
- `JWT_REFRESH_EXPIRES_IN` - Refresh token expiration (string, default: "7d")
- `BCRYPT_ROUNDS` - Password hashing rounds (number, default: 12)
- `AUTH_MAX_FAILED_ATTEMPTS` - Max failed login attempts (number, default: 5)
- `AUTH_LOCKOUT_DURATION_MINUTES` - Lockout duration (number, default: 30)
- `GOOGLE_CLIENT_ID` - Google OAuth client ID (string, optional)
- `GOOGLE_CLIENT_SECRET` - Google OAuth secret (string, optional)
- `GITHUB_CLIENT_ID` - GitHub OAuth client ID (string, optional)
- `GITHUB_CLIENT_SECRET` - GitHub OAuth secret (string, optional)

#### Redis
- `REDIS_HOST` - Redis host (string, default: "localhost")
- `REDIS_PORT` - Redis port (number, default: 6379)
- `REDIS_PASSWORD` - Redis password (string, optional)
- `REDIS_DB` - Redis database number (number, default: 0)
- `CACHE_TTL` - Cache TTL in seconds (number, default: 3600)
- `REDIS_KEY_PREFIX` - Redis key prefix (string, default: "cache:")

#### Admin
- `ADMIN_EMAIL` - Admin email (string, default: "admin@example.com")
- `ADMIN_PASSWORD` - Admin password (string, **required in production**)
- `ADMIN_ALLOWED_IPS` - Allowed IP addresses (comma-separated, optional)

#### Email
- `EMAIL_STATUS` - Enable email sending (string, "enabled" or other, default: disabled)
- `EMAIL_FROM` - From email address (string, default: "noreply@example.com")
- `BREVO_API_KEY` - Brevo API key (string, optional)
- `SMTP_HOST` - SMTP host (string, optional)
- `SMTP_PORT` - SMTP port (number, default: 587)
- `SMTP_SECURE` - Use TLS (boolean, default: true)
- `SMTP_USER` - SMTP username (string, optional)
- `SMTP_PASS` - SMTP password (string, optional)

#### S3 Storage
- `S3_ENDPOINT` - S3 endpoint (string, default: "s3.amazonaws.com")
- `S3_PORT` - S3 port (number, default: 443)
- `S3_USE_SSL` - Use SSL (boolean, default: true)
- `S3_REGION` - S3 region (string, default: "eu-west-3")
- `S3_ACCESS_KEY` - S3 access key (string, default: "")
- `S3_SECRET_KEY` - S3 secret key (string, default: "")
- `S3_BUCKET_NAME` - S3 bucket name (string, default: "nestjs-boilerplate-files")

#### RabbitMQ
- `RABBITMQ_URI` - Full connection URI (string, optional - overrides individual settings)
- `RABBITMQ_USER` - RabbitMQ user (string, default: "guest")
- `RABBITMQ_PASSWORD` - RabbitMQ password (string, default: "guest")
- `RABBITMQ_HOST` - RabbitMQ host (string, default: "localhost")
- `RABBITMQ_PORT` - RabbitMQ port (string, default: "5672")
- `RABBITMQ_VHOST` - RabbitMQ virtual host (string, default: "/")
- `RABBITMQ_EXCHANGE` - Exchange name (string, default: "app.notifications")
- `RABBITMQ_DLX_EXCHANGE` - Dead-letter exchange (string, default: "app.notifications.dlx")

#### Logging
- `LOG_LEVEL` - Log level (string, default: "info") - Values: error, warn, info, debug, verbose
- `LOG_FORMAT` - Log format (string, default: "json") - Values: json, pretty
- `LOG_TRANSPORTS` - Transports (comma-separated, default: "console") - Values: console, file
- `LOG_FILE` - Log file path (string, optional)
- `LOG_MAX_SIZE` - Max log file size (string, default: "10m")
- `LOG_MAX_FILES` - Max log files to keep (number, default: 5)

#### Feature Flags
- `FEATURE_NEW_UI` - Enable new UI (boolean, default: false)
- `FEATURE_BETA` - Enable beta features (boolean, default: false)
- `FEATURE_ANALYTICS` - Enable analytics (boolean, default: true)
- `MAINTENANCE_MODE` - Maintenance mode (boolean, default: false)

### Type Parsing

The config loader automatically parses types:
- **Boolean**: "true", "1", "yes" → true; "false", "0", "no" → false
- **Number**: Parsed with parseInt/parseFloat
- **Array**: Comma-separated values → string array
- **String**: Used as-is

## Architecture

This package exports **helpers only**:
- ✅ Schemas (Zod)
- ✅ Types (inferred from schemas)
- ✅ Builders (fluent API)
- ✅ Loaders (environment, file)
- ✅ Validators (with error messages)
- ✅ Utilities (merge, mask, parse)
- ✅ Presets (optional, not auto-applied)

This package does NOT export:
- ❌ Fixed configuration instances
- ❌ Singleton patterns
- ❌ Auto-initialized configs
- ❌ Module-level side effects

**Configuration values live in the consuming project**, not in this package.
