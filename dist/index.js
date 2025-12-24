'use strict';

var zod = require('zod');
var dotenv = require('dotenv');
var fs = require('fs');
var path = require('path');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var dotenv__namespace = /*#__PURE__*/_interopNamespace(dotenv);
var fs__namespace = /*#__PURE__*/_interopNamespace(fs);
var path__namespace = /*#__PURE__*/_interopNamespace(path);

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve2, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve2(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var DatabaseConfigSchema = zod.z.object({
  type: zod.z.literal("postgres").default("postgres"),
  host: zod.z.string(),
  port: zod.z.number().int().positive(),
  username: zod.z.string(),
  password: zod.z.string(),
  database: zod.z.string(),
  synchronize: zod.z.boolean().default(false),
  dropSchema: zod.z.boolean().optional(),
  logging: zod.z.boolean().default(false),
  ssl: zod.z.boolean().optional(),
  autoLoadEntities: zod.z.boolean().default(true),
  migrationsRun: zod.z.boolean().default(false),
  rlsEnabled: zod.z.boolean().default(false)
});
var OAuthProviderSchema = zod.z.object({
  clientId: zod.z.string(),
  clientSecret: zod.z.string()
});
var AuthConfigSchema = zod.z.object({
  jwtSecret: zod.z.string().min(32, "JWT secret must be at least 32 characters"),
  jwtRefreshSecret: zod.z.string().min(32, "JWT refresh secret must be at least 32 characters"),
  jwtExpiresIn: zod.z.string().default("15m"),
  jwtRefreshExpiresIn: zod.z.string().default("7d"),
  bcryptRounds: zod.z.number().int().min(10).max(20).default(12),
  maxFailedAttempts: zod.z.number().int().positive().default(5),
  lockoutDurationMinutes: zod.z.number().int().positive().default(30),
  google: OAuthProviderSchema.optional(),
  github: OAuthProviderSchema.optional()
});
var RedisConfigSchema = zod.z.object({
  host: zod.z.string(),
  port: zod.z.number().int().positive(),
  password: zod.z.string().optional(),
  db: zod.z.number().int().nonnegative().default(0),
  ttl: zod.z.number().int().positive().default(3600),
  keyPrefix: zod.z.string().default("cache:")
});
var AppConfigSchema = zod.z.object({
  name: zod.z.string(),
  url: zod.z.string().url(),
  port: zod.z.number().int().positive(),
  nodeEnv: zod.z.enum(["development", "production", "test", "staging"]).default("development"),
  corsOrigin: zod.z.string().default("*"),
  frontendUrl: zod.z.string().url(),
  rateLimitMax: zod.z.number().int().positive().default(100),
  rateLimitTtl: zod.z.number().int().positive().default(60)
});
var AdminConfigSchema = zod.z.object({
  email: zod.z.string().email(),
  password: zod.z.string().min(12, "Admin password must be at least 12 characters"),
  allowedIps: zod.z.array(zod.z.string()).optional()
});
var EmailConfigSchema = zod.z.object({
  enabled: zod.z.boolean().default(false),
  from: zod.z.string().email(),
  brevoApiKey: zod.z.string().optional(),
  smtp: zod.z.object({
    host: zod.z.string(),
    port: zod.z.number().int(),
    secure: zod.z.boolean().default(true),
    auth: zod.z.object({
      user: zod.z.string(),
      pass: zod.z.string()
    })
  }).optional()
});
var S3ConfigSchema = zod.z.object({
  endpoint: zod.z.string(),
  port: zod.z.number().int().positive(),
  useSSL: zod.z.boolean().default(true),
  region: zod.z.string(),
  accessKey: zod.z.string(),
  secretKey: zod.z.string(),
  bucketName: zod.z.string()
});
var RabbitMQConfigSchema = zod.z.object({
  uri: zod.z.string().url(),
  exchange: zod.z.string(),
  dlxExchange: zod.z.string(),
  connectionInitOptions: zod.z.object({
    wait: zod.z.boolean().default(true),
    timeout: zod.z.number().int().positive().default(1e4),
    reject: zod.z.boolean().default(true)
  }).optional()
});
var LoggingConfigSchema = zod.z.object({
  level: zod.z.enum(["debug", "info", "warn", "error"]).default("info"),
  format: zod.z.enum(["json", "pretty"]).default("json"),
  transports: zod.z.array(zod.z.enum(["console", "file"])).default(["console"]),
  fileConfig: zod.z.object({
    filename: zod.z.string(),
    maxSize: zod.z.string().default("10m"),
    maxFiles: zod.z.number().int().default(5)
  }).optional()
});
var FeatureFlagsConfigSchema = zod.z.object({
  enableNewUI: zod.z.boolean().default(false),
  enableBetaFeatures: zod.z.boolean().default(false),
  enableAnalytics: zod.z.boolean().default(true),
  maintenanceMode: zod.z.boolean().default(false)
});
var ConfigurationSchema = zod.z.object({
  app: AppConfigSchema,
  database: DatabaseConfigSchema,
  auth: AuthConfigSchema,
  redis: RedisConfigSchema.optional(),
  admin: AdminConfigSchema.optional(),
  email: EmailConfigSchema.optional(),
  s3: S3ConfigSchema.optional(),
  rabbitmq: RabbitMQConfigSchema.optional(),
  logging: LoggingConfigSchema.optional(),
  featureFlags: FeatureFlagsConfigSchema.optional()
});

// src/config/defaults.ts
var DEVELOPMENT_PRESET = {
  app: {
    nodeEnv: "development",
    corsOrigin: "*",
    rateLimitMax: 1e3,
    rateLimitTtl: 60
  },
  database: {
    synchronize: true,
    dropSchema: false,
    // Don't drop schema by default, let user decide
    logging: true,
    ssl: false,
    migrationsRun: false,
    rlsEnabled: false
  },
  logging: {
    level: "debug",
    format: "pretty",
    transports: ["console"]
  },
  featureFlags: {
    enableNewUI: true,
    enableBetaFeatures: true,
    enableAnalytics: false,
    maintenanceMode: false
  }
};
var PRODUCTION_PRESET = {
  app: {
    nodeEnv: "production",
    corsOrigin: "",
    // Should be overridden with specific domains
    rateLimitMax: 100,
    rateLimitTtl: 60
  },
  database: {
    synchronize: false,
    // Never auto-sync in production
    dropSchema: false,
    logging: false,
    ssl: true,
    migrationsRun: true,
    rlsEnabled: true
  },
  logging: {
    level: "info",
    format: "json",
    transports: ["console", "file"]
  },
  featureFlags: {
    enableNewUI: false,
    enableBetaFeatures: false,
    enableAnalytics: true,
    maintenanceMode: false
  }
};
var STAGING_PRESET = {
  app: {
    nodeEnv: "staging",
    corsOrigin: "*",
    rateLimitMax: 200,
    rateLimitTtl: 60
  },
  database: {
    synchronize: false,
    dropSchema: false,
    logging: true,
    ssl: true,
    migrationsRun: true,
    rlsEnabled: true
  },
  logging: {
    level: "debug",
    format: "json",
    transports: ["console"]
  },
  featureFlags: {
    enableNewUI: true,
    enableBetaFeatures: true,
    enableAnalytics: true,
    maintenanceMode: false
  }
};
var TEST_PRESET = {
  app: {
    nodeEnv: "test",
    corsOrigin: "*",
    rateLimitMax: 1e4,
    rateLimitTtl: 60
  },
  database: {
    synchronize: true,
    dropSchema: true,
    logging: false,
    ssl: false,
    migrationsRun: false,
    rlsEnabled: false
  },
  logging: {
    level: "error",
    format: "json",
    transports: ["console"]
  },
  featureFlags: {
    enableNewUI: false,
    enableBetaFeatures: false,
    enableAnalytics: false,
    maintenanceMode: false
  }
};
function getPreset(preset) {
  switch (preset) {
    case "development":
      return DEVELOPMENT_PRESET;
    case "production":
      return PRODUCTION_PRESET;
    case "staging":
      return STAGING_PRESET;
    case "test":
      return TEST_PRESET;
    default:
      throw new Error(`Unknown preset: ${preset}`);
  }
}
var DEFAULT_DATABASE_CONFIG = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "app",
  synchronize: false,
  logging: false,
  autoLoadEntities: true,
  migrationsRun: false,
  rlsEnabled: false
};
var DEFAULT_REDIS_CONFIG = {
  host: "localhost",
  port: 6379,
  db: 0,
  ttl: 3600,
  keyPrefix: "cache:"
};
var DEFAULT_JWT_CONFIG = {
  jwtExpiresIn: "15m",
  jwtRefreshExpiresIn: "7d",
  bcryptRounds: 12,
  maxFailedAttempts: 5,
  lockoutDurationMinutes: 30
};
var DEFAULT_RATE_LIMIT = {
  max: 100,
  ttl: 60
};
var DEFAULT_LOGGING_CONFIG = {
  level: "info",
  format: "json",
  transports: ["console"]
};

// src/config/utils.ts
function deepMerge(target, source) {
  const output = __spreadValues({}, target);
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
function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}
function maskSecrets(config2) {
  const sensitiveKeys = [
    "password",
    "secret",
    "apikey",
    "token",
    "secretkey",
    "accesskey",
    "clientsecret",
    "auth"
  ];
  const mask = (obj) => {
    if (!isObject(obj)) return obj;
    const masked = __spreadValues({}, obj);
    Object.keys(masked).forEach((key) => {
      const lowerKey = key.toLowerCase();
      if (sensitiveKeys.some((sensitive) => lowerKey.includes(sensitive))) {
        masked[key] = "***REDACTED***";
      } else if (isObject(masked[key])) {
        masked[key] = mask(masked[key]);
      }
    });
    return masked;
  };
  return mask(config2);
}
function parseBoolean(value, defaultValue = false) {
  if (!value) return defaultValue;
  const normalized = value.toLowerCase().trim();
  if (normalized === "true" || normalized === "1" || normalized === "yes") return true;
  if (normalized === "false" || normalized === "0" || normalized === "no") return false;
  return defaultValue;
}
function parseNumber(value, defaultValue) {
  if (!value) return defaultValue;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
}
function parseArray(value, defaultValue = []) {
  if (!value) return defaultValue;
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}
function requireEnv(key, errorMessage) {
  const value = process.env[key];
  if (!value) {
    throw new Error(errorMessage || `Required environment variable ${key} is not set`);
  }
  return value;
}
function getEnv(key, defaultValue) {
  return process.env[key] || defaultValue;
}
function validateProductionSecrets(config2) {
  var _a, _b, _c, _d, _e;
  if (((_a = config2.app) == null ? void 0 : _a.nodeEnv) !== "production") {
    return;
  }
  if (!((_b = config2.auth) == null ? void 0 : _b.jwtSecret) || config2.auth.jwtSecret.length < 32) {
    throw new Error(
      "SECURITY ERROR: JWT_SECRET must be set with at least 32 characters in production"
    );
  }
  if (!((_c = config2.auth) == null ? void 0 : _c.jwtRefreshSecret) || config2.auth.jwtRefreshSecret.length < 32) {
    throw new Error(
      "SECURITY ERROR: JWT_REFRESH_SECRET must be set with at least 32 characters in production"
    );
  }
  if (!((_d = config2.admin) == null ? void 0 : _d.password) || config2.admin.password === "change-me-in-production" || config2.admin.password.length < 12) {
    throw new Error(
      "SECURITY ERROR: ADMIN_PASSWORD must be set to a strong password (at least 12 characters) in production"
    );
  }
  if (!((_e = config2.database) == null ? void 0 : _e.password) || config2.database.password === "postgres") {
    throw new Error(
      "SECURITY ERROR: DATABASE_PASSWORD must be set to a strong password in production"
    );
  }
}

// src/config/loaders.ts
function loadDotEnv(envFilePath = ".env", override = false) {
  const resolvedPath = path__namespace.resolve(process.cwd(), envFilePath);
  if (fs__namespace.existsSync(resolvedPath)) {
    dotenv__namespace.config({ path: resolvedPath, override });
  }
}
var prefixKey = (prefix, key) => `${prefix}${key}`;
function loadAppFromEnv(prefix = "") {
  return {
    name: getEnv(prefixKey(prefix, "APP_NAME"), "NestJS Boilerplate"),
    url: getEnv(prefixKey(prefix, "APP_URL"), "http://localhost:3000"),
    frontendUrl: getEnv(prefixKey(prefix, "FRONTEND_URL"), "http://localhost:3001"),
    port: parseNumber(process.env[prefixKey(prefix, "PORT")], 3e3),
    nodeEnv: process.env[prefixKey(prefix, "NODE_ENV")] || "development",
    corsOrigin: getEnv(prefixKey(prefix, "CORS_ORIGIN"), "*"),
    rateLimitMax: parseNumber(process.env[prefixKey(prefix, "RATE_LIMIT_MAX")], 100),
    rateLimitTtl: parseNumber(process.env[prefixKey(prefix, "RATE_LIMIT_TTL")], 60)
  };
}
function loadDatabaseFromEnv(prefix = "") {
  return {
    type: "postgres",
    host: getEnv(prefixKey(prefix, "DATABASE_HOST"), "localhost"),
    port: parseNumber(process.env[prefixKey(prefix, "DATABASE_PORT")], 5432),
    username: getEnv(prefixKey(prefix, "DATABASE_USERNAME"), "postgres"),
    password: getEnv(prefixKey(prefix, "DATABASE_PASSWORD"), "postgres"),
    database: getEnv(prefixKey(prefix, "DATABASE_NAME"), "nestjs_boilerplate"),
    synchronize: !parseBoolean(process.env[prefixKey(prefix, "USE_MIGRATIONS")], false),
    dropSchema: parseBoolean(process.env[prefixKey(prefix, "DATABASE_DROP_SCHEMA")], false),
    logging: parseBoolean(process.env[prefixKey(prefix, "DATABASE_LOGGING")], false),
    ssl: parseBoolean(process.env[prefixKey(prefix, "DATABASE_SSL")], false),
    autoLoadEntities: true,
    migrationsRun: parseBoolean(process.env[prefixKey(prefix, "USE_MIGRATIONS")], false),
    rlsEnabled: parseBoolean(process.env[prefixKey(prefix, "RLS_ENABLED")], false)
  };
}
function loadAuthFromEnv(prefix = "") {
  return __spreadValues(__spreadValues({
    jwtSecret: getEnv(prefixKey(prefix, "JWT_SECRET"), "jwt-secret-key-DEVELOPMENT-ONLY"),
    jwtRefreshSecret: getEnv(
      prefixKey(prefix, "JWT_REFRESH_SECRET"),
      "jwt-refresh-secret-key-DEVELOPMENT-ONLY"
    ),
    jwtExpiresIn: getEnv(prefixKey(prefix, "JWT_EXPIRES_IN"), "15m"),
    jwtRefreshExpiresIn: getEnv(prefixKey(prefix, "JWT_REFRESH_EXPIRES_IN"), "7d"),
    bcryptRounds: parseNumber(process.env[prefixKey(prefix, "BCRYPT_ROUNDS")], 12),
    maxFailedAttempts: parseNumber(process.env[prefixKey(prefix, "AUTH_MAX_FAILED_ATTEMPTS")], 5),
    lockoutDurationMinutes: parseNumber(
      process.env[prefixKey(prefix, "AUTH_LOCKOUT_DURATION_MINUTES")],
      30
    )
  }, process.env[prefixKey(prefix, "GOOGLE_CLIENT_ID")] && process.env[prefixKey(prefix, "GOOGLE_CLIENT_SECRET")] ? {
    google: {
      clientId: process.env[prefixKey(prefix, "GOOGLE_CLIENT_ID")],
      clientSecret: process.env[prefixKey(prefix, "GOOGLE_CLIENT_SECRET")]
    }
  } : {}), process.env[prefixKey(prefix, "GITHUB_CLIENT_ID")] && process.env[prefixKey(prefix, "GITHUB_CLIENT_SECRET")] ? {
    github: {
      clientId: process.env[prefixKey(prefix, "GITHUB_CLIENT_ID")],
      clientSecret: process.env[prefixKey(prefix, "GITHUB_CLIENT_SECRET")]
    }
  } : {});
}
function loadRedisFromEnv(prefix = "") {
  return {
    host: getEnv(prefixKey(prefix, "REDIS_HOST"), "localhost"),
    port: parseNumber(process.env[prefixKey(prefix, "REDIS_PORT")], 6379),
    password: process.env[prefixKey(prefix, "REDIS_PASSWORD")],
    db: parseNumber(process.env[prefixKey(prefix, "REDIS_DB")], 0),
    ttl: parseNumber(process.env[prefixKey(prefix, "CACHE_TTL")], 3600),
    keyPrefix: getEnv(prefixKey(prefix, "REDIS_KEY_PREFIX"), "cache:")
  };
}
function loadAdminFromEnv(prefix = "") {
  return {
    email: getEnv(prefixKey(prefix, "ADMIN_EMAIL"), "admin@example.com"),
    password: getEnv(prefixKey(prefix, "ADMIN_PASSWORD"), "change-me-in-production"),
    allowedIps: process.env[prefixKey(prefix, "ADMIN_ALLOWED_IPS")] ? parseArray(process.env[prefixKey(prefix, "ADMIN_ALLOWED_IPS")]) : void 0
  };
}
function loadEmailFromEnv(prefix = "") {
  return __spreadValues({
    enabled: process.env[prefixKey(prefix, "EMAIL_STATUS")] === "enabled",
    from: getEnv(prefixKey(prefix, "EMAIL_FROM"), "noreply@example.com"),
    brevoApiKey: process.env[prefixKey(prefix, "BREVO_API_KEY")]
  }, process.env[prefixKey(prefix, "SMTP_HOST")] ? {
    smtp: {
      host: process.env[prefixKey(prefix, "SMTP_HOST")],
      port: parseNumber(process.env[prefixKey(prefix, "SMTP_PORT")], 587),
      secure: parseBoolean(process.env[prefixKey(prefix, "SMTP_SECURE")], true),
      auth: {
        user: getEnv(prefixKey(prefix, "SMTP_USER"), ""),
        pass: getEnv(prefixKey(prefix, "SMTP_PASS"), "")
      }
    }
  } : {});
}
function loadS3FromEnv(prefix = "") {
  return {
    endpoint: getEnv(prefixKey(prefix, "S3_ENDPOINT"), "s3.amazonaws.com"),
    port: parseNumber(process.env[prefixKey(prefix, "S3_PORT")], 443),
    useSSL: parseBoolean(process.env[prefixKey(prefix, "S3_USE_SSL")], true),
    region: getEnv(prefixKey(prefix, "S3_REGION"), "eu-west-3"),
    accessKey: getEnv(prefixKey(prefix, "S3_ACCESS_KEY"), ""),
    secretKey: getEnv(prefixKey(prefix, "S3_SECRET_KEY"), ""),
    bucketName: getEnv(prefixKey(prefix, "S3_BUCKET_NAME"), "nestjs-boilerplate-files")
  };
}
function loadRabbitMQFromEnv(prefix = "") {
  return {
    uri: process.env[prefixKey(prefix, "RABBITMQ_URI")] || `amqp://${getEnv(prefixKey(prefix, "RABBITMQ_USER"), "guest")}:${getEnv(prefixKey(prefix, "RABBITMQ_PASSWORD"), "guest")}@${getEnv(prefixKey(prefix, "RABBITMQ_HOST"), "localhost")}:${getEnv(prefixKey(prefix, "RABBITMQ_PORT"), "5672")}${process.env[prefixKey(prefix, "RABBITMQ_VHOST")] && process.env[prefixKey(prefix, "RABBITMQ_VHOST")] !== "/" ? `/${process.env[prefixKey(prefix, "RABBITMQ_VHOST")]}` : ""}`,
    exchange: getEnv(prefixKey(prefix, "RABBITMQ_EXCHANGE"), "app.notifications"),
    dlxExchange: getEnv(prefixKey(prefix, "RABBITMQ_DLX_EXCHANGE"), "app.notifications.dlx"),
    connectionInitOptions: {
      wait: process.env[prefixKey(prefix, "NODE_ENV")] !== "test",
      timeout: 1e4,
      reject: true
    }
  };
}
function loadLoggingFromEnv(prefix = "") {
  return __spreadValues({
    level: getEnv(prefixKey(prefix, "LOG_LEVEL"), "info") || "info",
    format: getEnv(prefixKey(prefix, "LOG_FORMAT"), "json") || "json",
    transports: parseArray(process.env[prefixKey(prefix, "LOG_TRANSPORTS")], ["console"])
  }, process.env[prefixKey(prefix, "LOG_FILE")] ? {
    fileConfig: {
      filename: process.env[prefixKey(prefix, "LOG_FILE")],
      maxSize: getEnv(prefixKey(prefix, "LOG_MAX_SIZE"), "10m"),
      maxFiles: parseNumber(process.env[prefixKey(prefix, "LOG_MAX_FILES")], 5)
    }
  } : {});
}
function loadFeatureFlagsFromEnv(prefix = "") {
  return {
    enableNewUI: parseBoolean(process.env[prefixKey(prefix, "FEATURE_NEW_UI")], false),
    enableBetaFeatures: parseBoolean(process.env[prefixKey(prefix, "FEATURE_BETA")], false),
    enableAnalytics: parseBoolean(process.env[prefixKey(prefix, "FEATURE_ANALYTICS")], true),
    maintenanceMode: parseBoolean(process.env[prefixKey(prefix, "MAINTENANCE_MODE")], false)
  };
}
function loadFromEnv(prefix = "") {
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
    featureFlags: loadFeatureFlagsFromEnv(prefix)
  };
}
function loadFromFile(filePath) {
  try {
    const fileContent = __require(filePath);
    return fileContent;
  } catch (error) {
    throw new Error(`Failed to load configuration from file ${filePath}: ${error}`);
  }
}
function loadTestConfig() {
  return {
    app: {
      name: "Test App",
      url: "http://localhost:3000",
      frontendUrl: "http://localhost:3001",
      port: 3e3,
      nodeEnv: "test",
      corsOrigin: "*",
      rateLimitMax: 1e3,
      rateLimitTtl: 60
    },
    database: {
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "test",
      password: "test",
      database: "test_db",
      synchronize: true,
      dropSchema: true,
      logging: false,
      autoLoadEntities: true,
      migrationsRun: false,
      rlsEnabled: false
    },
    auth: {
      jwtSecret: "test-jwt-secret-32-characters-long-for-testing",
      jwtRefreshSecret: "test-refresh-secret-32-characters-long-for-testing",
      jwtExpiresIn: "15m",
      jwtRefreshExpiresIn: "7d",
      bcryptRounds: 10,
      maxFailedAttempts: 5,
      lockoutDurationMinutes: 30
    },
    redis: {
      host: "localhost",
      port: 6379,
      db: 1,
      ttl: 3600,
      keyPrefix: "test:"
    },
    admin: {
      email: "admin@test.com",
      password: "test-admin-password-secure"
    },
    email: {
      enabled: false,
      from: "test@example.com"
    },
    s3: {
      endpoint: "s3.amazonaws.com",
      port: 443,
      useSSL: true,
      region: "eu-west-3",
      accessKey: "test-access-key",
      secretKey: "test-secret-key",
      bucketName: "test-bucket"
    },
    rabbitmq: {
      uri: "amqp://guest:guest@localhost:5672",
      exchange: "test.exchange",
      dlxExchange: "test.exchange.dlx",
      connectionInitOptions: {
        wait: false,
        timeout: 1e4,
        reject: true
      }
    },
    logging: {
      level: "error",
      format: "json",
      transports: ["console"]
    },
    featureFlags: {
      enableNewUI: false,
      enableBetaFeatures: false,
      enableAnalytics: false,
      maintenanceMode: false
    }
  };
}
function validateConfig(config2) {
  try {
    const validated = ConfigurationSchema.parse(config2);
    validateProductionSecrets(validated);
    return validated;
  } catch (error) {
    if (error instanceof zod.ZodError) {
      const errorMessages = error.issues.map((err) => `  - ${err.path.join(".")}: ${err.message}`).join("\n");
      throw new Error(`Configuration validation failed:
${errorMessages}`);
    }
    throw error;
  }
}
function safeValidateConfig(config2) {
  try {
    const validated = validateConfig(config2);
    return {
      success: true,
      data: validated
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        errors: error.message.split("\n").filter(Boolean)
      };
    }
    return {
      success: false,
      errors: ["Unknown validation error"]
    };
  }
}
function validatePartialConfig(config2) {
  const result = ConfigurationSchema.partial().safeParse(config2);
  if (!result.success) {
    const errorMessages = result.error.issues.map((err) => `  - ${err.path.join(".")}: ${err.message}`).join("\n");
    throw new Error(`Partial configuration validation failed:
${errorMessages}`);
  }
  return true;
}
function logConfigSafely(config2, logger = console.log) {
  const masked = maskSecrets(config2);
  logger(`Configuration loaded:
${JSON.stringify(masked, null, 2)}`);
}
function getConfigSummary(config2) {
  return __spreadProps(__spreadValues({
    environment: config2.app.nodeEnv,
    appName: config2.app.name,
    port: config2.app.port,
    database: {
      host: config2.database.host,
      port: config2.database.port,
      database: config2.database.database,
      ssl: config2.database.ssl
    }
  }, config2.redis ? {
    redis: {
      host: config2.redis.host,
      port: config2.redis.port,
      db: config2.redis.db
    }
  } : {}), {
    features: config2.featureFlags,
    logging: config2.logging
  });
}

// src/config/builder.ts
var ConfigBuilder = class _ConfigBuilder {
  constructor() {
    this.config = {};
    this.enabledSections = /* @__PURE__ */ new Set();
    this.customSections = /* @__PURE__ */ new Map();
    this.envPrefix = "";
  }
  /**
   * Set environment (development, staging, production, test)
   */
  environment(env) {
    var _a, _b;
    (_b = (_a = this.config).app) != null ? _b : _a.app = {};
    this.config.app.nodeEnv = env;
    return this;
  }
  /**
   * Enable and load application settings section
   * @param config - Optional config override (if not provided, loads from env)
   */
  app(config2) {
    this.enabledSections.add("app");
    const envConfig = config2 != null ? config2 : loadAppFromEnv(this.envPrefix);
    this.config.app = deepMerge(this.config.app || {}, envConfig);
    return this;
  }
  /**
   * Enable and load database configuration section
   * @param config - Optional config override (if not provided, loads from env)
   */
  database(config2) {
    this.enabledSections.add("database");
    const envConfig = config2 != null ? config2 : loadDatabaseFromEnv(this.envPrefix);
    this.config.database = deepMerge(this.config.database || {}, envConfig);
    return this;
  }
  /**
   * Enable and load authentication configuration section
   * @param config - Optional config override (if not provided, loads from env)
   */
  auth(config2) {
    this.enabledSections.add("auth");
    const envConfig = config2 != null ? config2 : loadAuthFromEnv(this.envPrefix);
    this.config.auth = deepMerge(this.config.auth || {}, envConfig);
    return this;
  }
  /**
   * Enable and load Redis cache configuration section
   * @param config - Optional config override (if not provided, loads from env)
   */
  redis(config2) {
    this.enabledSections.add("redis");
    const envConfig = config2 != null ? config2 : loadRedisFromEnv(this.envPrefix);
    this.config.redis = deepMerge(this.config.redis || {}, envConfig);
    return this;
  }
  /**
   * Enable and load admin panel configuration section
   * @param config - Optional config override (if not provided, loads from env)
   */
  admin(config2) {
    this.enabledSections.add("admin");
    const envConfig = config2 != null ? config2 : loadAdminFromEnv(this.envPrefix);
    this.config.admin = deepMerge(this.config.admin || {}, envConfig);
    return this;
  }
  /**
   * Enable and load email service configuration section
   * @param config - Optional config override (if not provided, loads from env)
   */
  email(config2) {
    this.enabledSections.add("email");
    const envConfig = config2 != null ? config2 : loadEmailFromEnv(this.envPrefix);
    this.config.email = deepMerge(this.config.email || {}, envConfig);
    return this;
  }
  /**
   * Enable and load S3 storage configuration section
   * @param config - Optional config override (if not provided, loads from env)
   */
  s3(config2) {
    this.enabledSections.add("s3");
    const envConfig = config2 != null ? config2 : loadS3FromEnv(this.envPrefix);
    this.config.s3 = deepMerge(this.config.s3 || {}, envConfig);
    return this;
  }
  /**
   * Enable and load RabbitMQ configuration section
   * @param config - Optional config override (if not provided, loads from env)
   */
  rabbitmq(config2) {
    this.enabledSections.add("rabbitmq");
    const envConfig = config2 != null ? config2 : loadRabbitMQFromEnv(this.envPrefix);
    this.config.rabbitmq = deepMerge(this.config.rabbitmq || {}, envConfig);
    return this;
  }
  /**
   * Enable and load logging configuration section
   * @param config - Optional config override (if not provided, loads from env)
   */
  logging(config2) {
    this.enabledSections.add("logging");
    const envConfig = config2 != null ? config2 : loadLoggingFromEnv(this.envPrefix);
    this.config.logging = deepMerge(this.config.logging || {}, envConfig);
    return this;
  }
  /**
   * Enable and load feature flags configuration section
   * @param config - Optional config override (if not provided, loads from env)
   */
  featureFlags(config2) {
    this.enabledSections.add("featureFlags");
    const envConfig = config2 != null ? config2 : loadFeatureFlagsFromEnv(this.envPrefix);
    this.config.featureFlags = deepMerge(this.config.featureFlags || {}, envConfig);
    return this;
  }
  /**
   * Load .env file into process.env (does NOT load config sections)
   * Use this before calling section methods like .app(), .database(), etc.
   *
   * @param envFilePath - Path to .env file (defaults to .env in current directory)
   * @param prefix - Optional prefix for environment variables (e.g., 'APP_')
   * @param override - Whether to override existing environment variables
   *
   * @example
   * ```typescript
   * // New selective loading approach
   * const config = createConfigBuilder()
   *   .fromDotEnv()          // Load .env file
   *   .app()                 // Enable and load app section
   *   .database()            // Enable and load database section
   *   .build();
   * ```
   */
  fromDotEnv(envFilePath = ".env", prefix = "", override = false) {
    loadDotEnv(envFilePath, override);
    this.envPrefix = prefix;
    return this;
  }
  /**
   * Load ALL configuration sections from environment variables (backward compatible)
   * This method loads all sections at once and enables them all.
   * For selective loading, use .fromDotEnv() followed by individual section methods.
   *
   * @param prefix - Optional prefix for environment variables (e.g., 'APP_')
   *
   * @example
   * ```typescript
   * // Old approach - loads all sections
   * const config = createConfigBuilder()
   *   .fromEnv()
   *   .build();
   * ```
   */
  fromEnv(prefix = "") {
    this.envPrefix = prefix;
    const envConfig = loadFromEnv(prefix);
    this.config = deepMerge(this.config, envConfig);
    this.enabledSections.add("app");
    this.enabledSections.add("database");
    this.enabledSections.add("auth");
    this.enabledSections.add("redis");
    this.enabledSections.add("admin");
    this.enabledSections.add("email");
    this.enabledSections.add("s3");
    this.enabledSections.add("rabbitmq");
    this.enabledSections.add("logging");
    this.enabledSections.add("featureFlags");
    return this;
  }
  /**
   * Load configuration from a JSON file
   * @param filePath - Path to JSON config file
   */
  fromFile(filePath) {
    const fileConfig = loadFromFile(filePath);
    this.config = deepMerge(this.config, fileConfig);
    return this;
  }
  /**
   * Load test configuration preset
   */
  fromTest() {
    const testConfig = loadTestConfig();
    this.config = deepMerge(this.config, testConfig);
    return this;
  }
  /**
   * Merge with another configuration object
   * @param config - Configuration to merge
   */
  merge(config2) {
    this.config = deepMerge(this.config, config2);
    return this;
  }
  /**
   * Override specific values (alias for merge)
   * @param config - Configuration to override
   */
  override(config2) {
    this.config = deepMerge(this.config, config2);
    return this;
  }
  /**
   * Use a preset configuration (development, production, test, staging)
   * @param preset - Preset name
   */
  preset(preset) {
    const presetConfig = getPreset(preset);
    this.config = deepMerge(this.config, presetConfig);
    return this;
  }
  /**
   * Conditionally apply configuration
   * @param condition - Boolean condition
   * @param fn - Function to apply if condition is true
   */
  when(condition, fn) {
    if (condition) {
      fn(this);
    }
    return this;
  }
  /**
   * Conditionally apply configuration based on environment
   * @param env - Environment to check
   * @param fn - Function to apply if environment matches
   */
  whenEnv(env, fn) {
    var _a;
    if (((_a = this.config.app) == null ? void 0 : _a.nodeEnv) === env) {
      fn(this);
    }
    return this;
  }
  /**
   * Enable development mode optimizations
   */
  forDevelopment() {
    return this.preset("development");
  }
  /**
   * Enable production mode optimizations
   */
  forProduction() {
    return this.preset("production");
  }
  /**
   * Enable test mode optimizations
   */
  forTest() {
    return this.preset("test");
  }
  /**
   * Enable staging mode optimizations
   */
  forStaging() {
    return this.preset("staging");
  }
  /**
   * Add a custom configuration section
   *
   * @param name - Section name (will be used as key in config object)
   * @param schema - Zod schema for validation
   * @param loaderOrConfig - Can be:
   *   - Function: Custom loader function (receives prefix as param)
   *   - Object: Static configuration object
   *   - Undefined: Empty config (to be filled via .override() or other methods)
   *
   * @example
   * ```typescript
   * // With custom loader function
   * import { createNestedEnvLoader } from '@bniddam-labs/core';
   *
   * const schema = z.object({
   *   url: z.string().url(),
   *   apiKey: z.string(),
   *   credentials: z.object({
   *     username: z.string(),
   *     password: z.string()
   *   })
   * });
   *
   * // Create a loader with default values
   * const loader = createNestedEnvLoader({
   *   url: 'http://localhost:3000',
   *   apiKey: '',
   *   credentials: {
   *     username: 'admin',
   *     password: 'secret'
   *   }
   * });
   *
   * const config = createConfigBuilder()
   *   .fromDotEnv()
   *   .app()
   *   .addCustom('myService', schema, loader)
   *   .build();
   * // Loader receives 'MY_SERVICE_' prefix (auto-generated from 'myService')
   * // Reads: MY_SERVICE_URL, MY_SERVICE_API_KEY, MY_SERVICE_CREDENTIALS_USERNAME, etc.
   * ```
   *
   * @example
   * ```typescript
   * // With static config
   * const config = createConfigBuilder()
   *   .app()
   *   .addCustom('myService', schema, {
   *     url: 'https://api.example.com',
   *     apiKey: process.env.MY_API_KEY,
   *     credentials: { username: 'user', password: 'pass' }
   *   })
   *   .build();
   * ```
   *
   * @example
   * ```typescript
   * // Empty config, fill later
   * const config = createConfigBuilder()
   *   .app()
   *   .addCustom('myService', schema)
   *   .override({
   *     myService: {
   *       url: 'https://api.example.com',
   *       apiKey: 'key',
   *       credentials: { username: 'user', password: 'pass' }
   *     }
   *   })
   *   .build();
   * ```
   */
  addCustom(name, schema, loaderOrConfig) {
    let configData;
    if (loaderOrConfig === void 0) {
      configData = {};
    } else if (typeof loaderOrConfig === "function") {
      const loader = loaderOrConfig;
      const autoPrefix = name.replace(/([A-Z])/g, "_$1").toUpperCase().replace(/^_/, "") + "_";
      const prefix = this.envPrefix || autoPrefix;
      configData = loader(prefix);
    } else {
      configData = loaderOrConfig;
    }
    this.customSections.set(name, { schema, config: configData });
    this.config[name] = deepMerge(this.config[name] || {}, configData);
    return this;
  }
  /**
   * Build and validate the final configuration
   * Creates a dynamic schema based on enabled sections and validates
   *
   * @template T - The final configuration type (defaults to Configuration)
   * @returns Validated configuration
   * @throws Error if validation fails
   *
   * @example
   * ```typescript
   * // Without custom sections - uses default Configuration type
   * const config = createConfigBuilder()
   *   .fromDotEnv()
   *   .app()
   *   .database()
   *   .build();
   *
   * // With custom sections - specify your complete type
   * type MyConfig = {
   *   app: AppConfig;
   *   database: DatabaseConfig;
   *   myService: { url: string; apiKey: string };
   * };
   *
   * const config = createConfigBuilder()
   *   .fromDotEnv()
   *   .app()
   *   .database()
   *   .addCustom('myService', schema, loader)
   *   .build<MyConfig>();
   *
   * // Now TypeScript knows about config.myService
   * console.log(config.myService.url);
   * ```
   */
  build() {
    const shouldEnableAll = this.enabledSections.size === 0 && this.customSections.size === 0;
    if (shouldEnableAll) {
      return validateConfig(this.config);
    }
    const schemaShape = {};
    if (this.enabledSections.has("app")) schemaShape.app = AppConfigSchema;
    if (this.enabledSections.has("database")) schemaShape.database = DatabaseConfigSchema;
    if (this.enabledSections.has("auth")) schemaShape.auth = AuthConfigSchema;
    if (this.enabledSections.has("redis")) schemaShape.redis = RedisConfigSchema;
    if (this.enabledSections.has("admin")) schemaShape.admin = AdminConfigSchema;
    if (this.enabledSections.has("email")) schemaShape.email = EmailConfigSchema;
    if (this.enabledSections.has("s3")) schemaShape.s3 = S3ConfigSchema;
    if (this.enabledSections.has("rabbitmq")) schemaShape.rabbitmq = RabbitMQConfigSchema;
    if (this.enabledSections.has("logging")) schemaShape.logging = LoggingConfigSchema;
    if (this.enabledSections.has("featureFlags")) schemaShape.featureFlags = FeatureFlagsConfigSchema;
    for (const [name, { schema }] of this.customSections.entries()) {
      schemaShape[name] = schema;
    }
    const dynamicSchema = zod.z.object(schemaShape);
    const result = dynamicSchema.safeParse(this.config);
    if (!result.success) {
      const errors = result.error.issues.map((err) => `${err.path.join(".")}: ${err.message}`);
      throw new Error(`Configuration validation failed:
${errors.join("\n")}`);
    }
    return result.data;
  }
  /**
   * Build without validation (unsafe, use for debugging)
   * @returns Partial configuration without validation
   */
  buildUnsafe() {
    return this.config;
  }
  /**
   * Get current config state (for inspection)
   * @returns Copy of current configuration state
   */
  peek() {
    return __spreadValues({}, this.config);
  }
  /**
   * Reset builder to empty state
   */
  reset() {
    this.config = {};
    return this;
  }
  /**
   * Clone the current builder state
   * @returns New builder with same configuration
   */
  clone() {
    const newBuilder = new _ConfigBuilder();
    newBuilder.config = __spreadValues({}, this.config);
    return newBuilder;
  }
};
function createConfigBuilder() {
  return new ConfigBuilder();
}
function createConfigFromDotEnv(envFilePath = ".env", prefix = "", override = false) {
  return createConfigBuilder().fromDotEnv(envFilePath, prefix, override).build();
}
function createConfigFromEnv(prefix = "") {
  return createConfigBuilder().fromEnv(prefix).build();
}
function createConfigFromPreset(preset, overrides) {
  const builder = createConfigBuilder().preset(preset);
  if (overrides) {
    builder.merge(overrides);
  }
  return builder.build();
}
function createTestConfig() {
  return createConfigBuilder().fromTest().build();
}

// src/config/custom.ts
function toEnvVarName(path2, prefix) {
  return `${prefix}${path2.replace(/\./g, "_").toUpperCase()}`;
}
function loadEnvValue(envVarName, defaultValue, type) {
  const value = process.env[envVarName];
  if (value === void 0) {
    return defaultValue;
  }
  if (!type) {
    if (defaultValue !== void 0) {
      if (typeof defaultValue === "number") type = "number";
      else if (typeof defaultValue === "boolean") type = "boolean";
      else if (Array.isArray(defaultValue)) type = "array";
      else type = "string";
    } else {
      type = "string";
    }
  }
  switch (type) {
    case "number":
      return parseNumber(value, defaultValue);
    case "boolean":
      return parseBoolean(value, defaultValue);
    case "array":
      return parseArray(value, defaultValue);
    case "string":
    default:
      return getEnv(envVarName, defaultValue);
  }
}
function createSimpleEnvLoader(mapping) {
  return (prefix) => {
    const result = {};
    for (const [key, defaultValue] of Object.entries(mapping)) {
      const envVarName = toEnvVarName(key, prefix);
      result[key] = loadEnvValue(envVarName, defaultValue);
    }
    return result;
  };
}
function createNestedEnvLoader(mapping) {
  return (prefix) => {
    const loadNested = (obj, path2 = []) => {
      if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
        const fullPath = path2.join(".");
        const envVarName = toEnvVarName(fullPath, prefix);
        return loadEnvValue(envVarName, obj);
      }
      const result = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = loadNested(value, [...path2, key]);
      }
      return result;
    };
    return loadNested(mapping);
  };
}
function createStaticLoader(config2) {
  return () => config2;
}
function normalizeLoader(input, defaultMapping) {
  if (typeof input === "function") {
    return input;
  }
  if (typeof input === "string") {
    if (!defaultMapping) {
      throw new Error(
        "When providing a prefix string, a default mapping must be provided"
      );
    }
    return createNestedEnvLoader(defaultMapping);
  }
  return createStaticLoader(input);
}

// src/result/result.ts
var Result = class _Result {
  constructor(_success, _data, _error) {
    this._success = _success;
    this._data = _data;
    this._error = _error;
  }
  /**
   * Create a success result
   *
   * @param data - Success data
   * @returns Success result
   *
   * @example
   * ```ts
   * const result = Result.ok({ id: 1, name: 'John' });
   * ```
   */
  static ok(data) {
    return new _Result(true, data, void 0);
  }
  /**
   * Create an error result
   *
   * @param error - Error
   * @returns Error result
   *
   * @example
   * ```ts
   * const result = Result.err(new Error('Not found'));
   * ```
   */
  static err(error) {
    return new _Result(false, void 0, error);
  }
  /**
   * Check if result is successful
   *
   * @returns True if successful
   *
   * @example
   * ```ts
   * if (result.isOk()) {
   *   console.log('Success!');
   * }
   * ```
   */
  isOk() {
    return this._success === true;
  }
  /**
   * Check if result is an error
   *
   * @returns True if error
   *
   * @example
   * ```ts
   * if (result.isErr()) {
   *   console.error('Failed!');
   * }
   * ```
   */
  isErr() {
    return this._success === false;
  }
  /**
   * Unwrap a successful result or throw an error
   *
   * @returns The data if successful
   * @throws Error if result is a failure
   *
   * @example
   * ```ts
   * const data = result.unwrap(); // throws if error
   * ```
   */
  unwrap() {
    if (this.isOk()) {
      return this._data;
    }
    throw this._error;
  }
  /**
   * Unwrap an error result or throw
   *
   * @returns The error if failed
   * @throws Error if result is a success
   *
   * @example
   * ```ts
   * const error = result.unwrapErr(); // throws if ok
   * ```
   */
  unwrapErr() {
    if (!this._success) {
      return this._error;
    }
    throw new Error("unwrapErr() called on an Ok result");
  }
  /**
   * Unwrap a successful result or return a default value
   *
   * @param defaultValue - Default value if error
   * @returns The data if successful, otherwise default value
   *
   * @example
   * ```ts
   * const data = result.unwrapOr([]); // returns [] if error
   * ```
   */
  unwrapOr(defaultValue) {
    if (this.isOk()) {
      return this._data;
    }
    return defaultValue;
  }
  /**
   * Unwrap a successful result or compute a value from the error
   *
   * @param fn - Function to compute default value from error
   * @returns The data if successful, otherwise computed value
   *
   * @example
   * ```ts
   * const data = result.unwrapOrElse(err => err.defaultValue);
   * ```
   */
  unwrapOrElse(fn) {
    return this._success ? this._data : fn(this._error);
  }
  /**
   * Map a successful result to a new value
   *
   * @param fn - Mapping function
   * @returns New result with mapped data
   *
   * @example
   * ```ts
   * const result = Result.ok(5);
   * const doubled = result.map(x => x * 2); // Result.ok(10)
   * ```
   */
  map(fn) {
    if (this._success) {
      return _Result.ok(fn(this._data));
    }
    return _Result.err(this._error);
  }
  /**
   * Map an error result to a new error
   *
   * @param fn - Mapping function
   * @returns New result with mapped error
   *
   * @example
   * ```ts
   * const result = Result.err('Not found');
   * const mapped = result.mapErr(e => new Error(e)); // Result.err(Error('Not found'))
   * ```
   */
  mapErr(fn) {
    if (!this._success) {
      return _Result.err(fn(this._error));
    }
    return _Result.ok(this._data);
  }
  /**
   * Chain operations that return Results (flatten nested Results)
   *
   * @param fn - Function that returns a Result
   * @returns Flattened result
   *
   * @example
   * ```ts
   * const result = Result.ok(5)
   *   .flatMap(x => Result.ok(x * 2)); // Result.ok(10)
   * ```
   */
  flatMap(fn) {
    if (this._success) {
      return fn(this._data);
    }
    return _Result.err(this._error);
  }
  /**
   * Alias for flatMap - chain operations that return Results
   *
   * @param fn - Function that returns a Result
   * @returns Flattened result
   *
   * @example
   * ```ts
   * const result = Result.ok(5)
   *   .andThen(x => Result.ok(x * 2)); // Result.ok(10)
   * ```
   */
  andThen(fn) {
    return this.flatMap(fn);
  }
  /**
   * Provide alternative Result if current is an error
   *
   * @param fn - Function that returns an alternative Result
   * @returns Current result if ok, otherwise alternative result
   *
   * @example
   * ```ts
   * const result = Result.err('Failed')
   *   .orElse(() => Result.ok('default')); // Result.ok('default')
   * ```
   */
  orElse(fn) {
    if (!this._success) {
      return fn(this._error);
    }
    return _Result.ok(this._data);
  }
  /**
   * Pattern matching for both success and error cases
   *
   * @param handlers - Object with ok and err handlers
   * @returns Result of the matched handler
   *
   * @example
   * ```ts
   * const value = result.match({
   *   ok: (data) => `Success: ${data}`,
   *   err: (error) => `Error: ${error.message}`
   * });
   * ```
   */
  match(handlers) {
    return this._success ? handlers.ok(this._data) : handlers.err(this._error);
  }
  /**
   * Execute side effects on success without modifying the Result
   *
   * @param fn - Side effect function
   * @returns The same result for chaining
   *
   * @example
   * ```ts
   * result
   *   .tap(data => console.log('Success:', data))
   *   .map(x => x * 2);
   * ```
   */
  tap(fn) {
    if (this._success) {
      fn(this._data);
    }
    return this;
  }
  /**
   * Alias for tap - execute side effects on success
   *
   * @param fn - Side effect function
   * @returns The same result for chaining
   *
   * @example
   * ```ts
   * result
   *   .inspect(data => console.log('Success:', data))
   *   .map(x => x * 2);
   * ```
   */
  inspect(fn) {
    return this.tap(fn);
  }
  /**
   * Execute side effects on error without modifying the Result
   *
   * @param fn - Side effect function
   * @returns The same result for chaining
   *
   * @example
   * ```ts
   * result
   *   .tapErr(error => console.error('Error:', error))
   *   .orElse(() => Result.ok('default'));
   * ```
   */
  tapErr(fn) {
    if (!this._success) {
      fn(this._error);
    }
    return this;
  }
  /**
   * Alias for tapErr - execute side effects on error
   *
   * @param fn - Side effect function
   * @returns The same result for chaining
   *
   * @example
   * ```ts
   * result
   *   .inspectErr(error => console.error('Error:', error))
   *   .orElse(() => Result.ok('default'));
   * ```
   */
  inspectErr(fn) {
    return this.tapErr(fn);
  }
  // ---- Helper methods ----
  /**
   * Wrap a function that may throw into a Result
   *
   * @param fn - Function that may throw
   * @param mapError - Optional function to map thrown error to E
   * @returns Result of the function execution
   *
   * @example
   * ```ts
   * const result = Result.try(() => JSON.parse(input));
   * const custom = Result.try(
   *   () => riskyOperation(),
   *   (e) => new CustomError(String(e))
   * );
   * ```
   */
  static try(fn, mapError = (e) => e) {
    try {
      return _Result.ok(fn());
    } catch (e) {
      return _Result.err(mapError(e));
    }
  }
  /**
   * Convert a Promise into a Result
   *
   * @param p - Promise to convert
   * @param mapError - Optional function to map rejection to E
   * @returns Promise that resolves to a Result
   *
   * @example
   * ```ts
   * const result = await Result.fromPromise(fetch('/api/data'));
   * const custom = await Result.fromPromise(
   *   asyncOperation(),
   *   (e) => new ApiError(String(e))
   * );
   * ```
   */
  static fromPromise(p, mapError = (e) => e) {
    return __async(this, null, function* () {
      try {
        return _Result.ok(yield p);
      } catch (e) {
        return _Result.err(mapError(e));
      }
    });
  }
  /**
   * Combine an array of Results into a single Result (fail-fast)
   *
   * Returns Ok with array of values if all results are Ok,
   * otherwise returns the first Err encountered.
   *
   * @param results - Array of results to combine
   * @returns Result containing array of values or first error
   *
   * @example
   * ```ts
   * const results = [Result.ok(1), Result.ok(2), Result.ok(3)];
   * const combined = Result.all(results); // Result.ok([1, 2, 3])
   *
   * const withError = [Result.ok(1), Result.err('fail'), Result.ok(3)];
   * const failed = Result.all(withError); // Result.err('fail')
   * ```
   */
  static all(results) {
    const out = [];
    for (const r of results) {
      if (r.isErr()) {
        return _Result.err(r.unwrapErr());
      }
      out.push(r.unwrap());
    }
    return _Result.ok(out);
  }
  /**
   * Map an array of values through a function returning Results (fail-fast)
   *
   * Similar to Array.map, but for Result-returning functions.
   * Stops at the first error encountered.
   *
   * @param values - Array of values to map
   * @param fn - Function that transforms value to Result
   * @returns Result containing array of transformed values or first error
   *
   * @example
   * ```ts
   * const parseNumbers = (s: string) =>
   *   isNaN(+s) ? Result.err('invalid') : Result.ok(+s);
   *
   * const result = Result.traverse(['1', '2', '3'], parseNumbers);
   * // Result.ok([1, 2, 3])
   *
   * const invalid = Result.traverse(['1', 'x', '3'], parseNumbers);
   * // Result.err('invalid')
   * ```
   */
  static traverse(values, fn) {
    const out = [];
    for (const v of values) {
      const r = fn(v);
      if (r.isErr()) {
        return _Result.err(r.unwrapErr());
      }
      out.push(r.unwrap());
    }
    return _Result.ok(out);
  }
};

// src/string/sanitization.helpers.ts
function sanitizeFilename(filename, maxLength = 255) {
  let sanitized = filename.replace(/\0/g, "");
  sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, "_");
  sanitized = sanitized.replace(/^[._]+|[._]+$/g, "");
  sanitized = sanitized.replace(/\.+/g, ".");
  const dotIndex = sanitized.lastIndexOf(".");
  const ext = dotIndex > 0 ? sanitized.slice(dotIndex) : "";
  const nameWithoutExt = dotIndex > 0 ? sanitized.slice(0, dotIndex) : sanitized;
  if (sanitized.length > maxLength) {
    const maxNameLength = maxLength - ext.length;
    sanitized = nameWithoutExt.slice(0, maxNameLength) + ext;
  }
  if (!sanitized || sanitized === ext || sanitized.length === 0) {
    throw new Error(
      `Cannot sanitize filename: "${filename}" results in an empty or invalid filename after sanitization`
    );
  }
  return sanitized;
}
function sanitizeSearchInput(search) {
  return search.replace(/[%_\\]/g, "\\$&");
}
function truncate(str, maxLength = 100, ellipsis = "...") {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength - ellipsis.length) + ellipsis;
}
function removeWhitespace(str) {
  return str.replace(/\s+/g, "");
}
function normalizeWhitespace(str) {
  return str.replace(/\s+/g, " ").trim();
}

// src/string/masking.helpers.ts
function maskEmail(email, visibleChars = 2) {
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) {
    return email;
  }
  const visiblePart = localPart.slice(0, Math.min(visibleChars, localPart.length));
  return `${visiblePart}***@${domain}`;
}
function maskPhone(phone, visibleDigits = 4) {
  if (phone.length <= visibleDigits) {
    return "*".repeat(phone.length);
  }
  const masked = phone.slice(0, -visibleDigits).replace(/[0-9]/g, "*");
  const visible = phone.slice(-visibleDigits);
  return masked + visible;
}
function maskCardNumber(cardNumber, visibleDigits = 4, separator = " ") {
  const digitsOnly = cardNumber.replace(/\D/g, "");
  if (digitsOnly.length <= visibleDigits) {
    return "*".repeat(digitsOnly.length);
  }
  const visible = digitsOnly.slice(-visibleDigits);
  const maskedCount = digitsOnly.length - visibleDigits;
  const maskedGroups = Math.ceil(maskedCount / 4);
  const masked = Array(maskedGroups).fill("****").join(separator);
  return `${masked}${separator}${visible}`;
}
function maskString(str, visibleStart = 2, visibleEnd = 2, maskChar = "*") {
  if (str.length <= visibleStart + visibleEnd) {
    return str;
  }
  const start = str.slice(0, visibleStart);
  const end = str.slice(-visibleEnd);
  const maskedLength = str.length - visibleStart - visibleEnd;
  return `${start}${maskChar.repeat(maskedLength)}${end}`;
}
var emailSchema = zod.z.email({ error: "Invalid email address" });
var phoneSchema = zod.z.string().regex(/^\+?[1-9]\d{1,14}$/, { error: "Invalid phone number format (E.164 format expected)" });
var urlSchema = zod.z.string().url({ error: "Invalid URL format" });
var filenameSchema = zod.z.string().min(1, { error: "Filename cannot be empty" }).max(255, { error: "Filename too long" }).regex(/^[a-zA-Z0-9._-]+$/, { error: "Filename contains invalid characters" });
var slugStringSchema = zod.z.string().min(1).max(100).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, { error: "Invalid slug format" });
var nonEmptyStringSchema = zod.z.string().trim().min(1, { error: "String cannot be empty" });
var alphanumericSchema = zod.z.string().regex(/^[a-zA-Z0-9]+$/, { error: "Must contain only letters and numbers" });
var hexColorSchema = zod.z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { error: "Invalid hex color format" });
var createStringSchema = (min, max, message) => zod.z.string().min(min, message ? { error: message } : void 0).max(max, message ? { error: message } : void 0);
var createEnumSchema = (values) => zod.z.enum(values);

// src/validation/validation.helpers.ts
function safeParse(schema, data) {
  const result = schema.safeParse(data);
  if (result.success) {
    return {
      success: true,
      data: result.data,
      errors: null
    };
  }
  return {
    success: false,
    data: null,
    errors: formatZodErrors(result.error)
  };
}
function parse(schema, data) {
  return schema.parse(data);
}
function validateAll(validations) {
  const errors = [];
  const data = {};
  for (const [key, [schema, value]] of Object.entries(validations)) {
    const result = safeParse(schema, value);
    if (result.success) {
      data[key] = result.data;
    } else {
      errors.push(
        ...result.errors.map((err) => __spreadProps(__spreadValues({}, err), {
          path: `${key}.${err.path}`
        }))
      );
    }
  }
  if (errors.length > 0) {
    return {
      success: false,
      data: null,
      errors
    };
  }
  return {
    success: true,
    data,
    errors: null
  };
}
function isValid(schema, data) {
  return schema.safeParse(data).success;
}
function formatZodErrors(error) {
  return error.issues.map((err) => ({
    path: err.path.join(".") || "root",
    message: err.message,
    code: err.code
  }));
}
function createValidator(schema) {
  return (data) => safeParse(schema, data);
}
function createTypeGuard(schema) {
  return (data) => isValid(schema, data);
}

exports.AdminConfigSchema = AdminConfigSchema;
exports.AppConfigSchema = AppConfigSchema;
exports.AuthConfigSchema = AuthConfigSchema;
exports.ConfigBuilder = ConfigBuilder;
exports.ConfigurationSchema = ConfigurationSchema;
exports.DEFAULT_DATABASE_CONFIG = DEFAULT_DATABASE_CONFIG;
exports.DEFAULT_JWT_CONFIG = DEFAULT_JWT_CONFIG;
exports.DEFAULT_LOGGING_CONFIG = DEFAULT_LOGGING_CONFIG;
exports.DEFAULT_RATE_LIMIT = DEFAULT_RATE_LIMIT;
exports.DEFAULT_REDIS_CONFIG = DEFAULT_REDIS_CONFIG;
exports.DEVELOPMENT_PRESET = DEVELOPMENT_PRESET;
exports.DatabaseConfigSchema = DatabaseConfigSchema;
exports.EmailConfigSchema = EmailConfigSchema;
exports.FeatureFlagsConfigSchema = FeatureFlagsConfigSchema;
exports.LoggingConfigSchema = LoggingConfigSchema;
exports.OAuthProviderSchema = OAuthProviderSchema;
exports.PRODUCTION_PRESET = PRODUCTION_PRESET;
exports.RabbitMQConfigSchema = RabbitMQConfigSchema;
exports.RedisConfigSchema = RedisConfigSchema;
exports.Result = Result;
exports.S3ConfigSchema = S3ConfigSchema;
exports.STAGING_PRESET = STAGING_PRESET;
exports.TEST_PRESET = TEST_PRESET;
exports.alphanumericSchema = alphanumericSchema;
exports.createConfigBuilder = createConfigBuilder;
exports.createConfigFromDotEnv = createConfigFromDotEnv;
exports.createConfigFromEnv = createConfigFromEnv;
exports.createConfigFromPreset = createConfigFromPreset;
exports.createEnumSchema = createEnumSchema;
exports.createNestedEnvLoader = createNestedEnvLoader;
exports.createSimpleEnvLoader = createSimpleEnvLoader;
exports.createStaticLoader = createStaticLoader;
exports.createStringSchema = createStringSchema;
exports.createTestConfig = createTestConfig;
exports.createTypeGuard = createTypeGuard;
exports.createValidator = createValidator;
exports.deepMerge = deepMerge;
exports.emailSchema = emailSchema;
exports.filenameSchema = filenameSchema;
exports.formatZodErrors = formatZodErrors;
exports.getConfigSummary = getConfigSummary;
exports.getEnv = getEnv;
exports.getPreset = getPreset;
exports.hexColorSchema = hexColorSchema;
exports.isValid = isValid;
exports.loadAdminFromEnv = loadAdminFromEnv;
exports.loadAppFromEnv = loadAppFromEnv;
exports.loadAuthFromEnv = loadAuthFromEnv;
exports.loadDatabaseFromEnv = loadDatabaseFromEnv;
exports.loadDotEnv = loadDotEnv;
exports.loadEmailFromEnv = loadEmailFromEnv;
exports.loadEnvValue = loadEnvValue;
exports.loadFeatureFlagsFromEnv = loadFeatureFlagsFromEnv;
exports.loadFromEnv = loadFromEnv;
exports.loadFromFile = loadFromFile;
exports.loadLoggingFromEnv = loadLoggingFromEnv;
exports.loadRabbitMQFromEnv = loadRabbitMQFromEnv;
exports.loadRedisFromEnv = loadRedisFromEnv;
exports.loadS3FromEnv = loadS3FromEnv;
exports.loadTestConfig = loadTestConfig;
exports.logConfigSafely = logConfigSafely;
exports.maskCardNumber = maskCardNumber;
exports.maskEmail = maskEmail;
exports.maskPhone = maskPhone;
exports.maskSecrets = maskSecrets;
exports.maskString = maskString;
exports.nonEmptyStringSchema = nonEmptyStringSchema;
exports.normalizeLoader = normalizeLoader;
exports.normalizeWhitespace = normalizeWhitespace;
exports.parse = parse;
exports.parseArray = parseArray;
exports.parseBoolean = parseBoolean;
exports.parseNumber = parseNumber;
exports.phoneSchema = phoneSchema;
exports.removeWhitespace = removeWhitespace;
exports.requireEnv = requireEnv;
exports.safeParse = safeParse;
exports.safeValidateConfig = safeValidateConfig;
exports.sanitizeFilename = sanitizeFilename;
exports.sanitizeSearchInput = sanitizeSearchInput;
exports.slugStringSchema = slugStringSchema;
exports.toEnvVarName = toEnvVarName;
exports.truncate = truncate;
exports.urlSchema = urlSchema;
exports.validateAll = validateAll;
exports.validateConfig = validateConfig;
exports.validatePartialConfig = validatePartialConfig;
exports.validateProductionSecrets = validateProductionSecrets;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map