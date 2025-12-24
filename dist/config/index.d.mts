import { z, ZodType } from 'zod';

/**
 * Configuration schemas using Zod
 * These schemas are the single source of truth for configuration types
 */
/**
 * Database configuration schema
 */
declare const DatabaseConfigSchema: z.ZodObject<{
    type: z.ZodDefault<z.ZodLiteral<"postgres">>;
    host: z.ZodString;
    port: z.ZodNumber;
    username: z.ZodString;
    password: z.ZodString;
    database: z.ZodString;
    synchronize: z.ZodDefault<z.ZodBoolean>;
    dropSchema: z.ZodOptional<z.ZodBoolean>;
    logging: z.ZodDefault<z.ZodBoolean>;
    ssl: z.ZodOptional<z.ZodBoolean>;
    autoLoadEntities: z.ZodDefault<z.ZodBoolean>;
    migrationsRun: z.ZodDefault<z.ZodBoolean>;
    rlsEnabled: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
/**
 * OAuth provider configuration schema
 */
declare const OAuthProviderSchema: z.ZodObject<{
    clientId: z.ZodString;
    clientSecret: z.ZodString;
}, z.core.$strip>;
/**
 * Authentication configuration schema
 */
declare const AuthConfigSchema: z.ZodObject<{
    jwtSecret: z.ZodString;
    jwtRefreshSecret: z.ZodString;
    jwtExpiresIn: z.ZodDefault<z.ZodString>;
    jwtRefreshExpiresIn: z.ZodDefault<z.ZodString>;
    bcryptRounds: z.ZodDefault<z.ZodNumber>;
    maxFailedAttempts: z.ZodDefault<z.ZodNumber>;
    lockoutDurationMinutes: z.ZodDefault<z.ZodNumber>;
    google: z.ZodOptional<z.ZodObject<{
        clientId: z.ZodString;
        clientSecret: z.ZodString;
    }, z.core.$strip>>;
    github: z.ZodOptional<z.ZodObject<{
        clientId: z.ZodString;
        clientSecret: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Redis cache configuration schema
 */
declare const RedisConfigSchema: z.ZodObject<{
    host: z.ZodString;
    port: z.ZodNumber;
    password: z.ZodOptional<z.ZodString>;
    db: z.ZodDefault<z.ZodNumber>;
    ttl: z.ZodDefault<z.ZodNumber>;
    keyPrefix: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
/**
 * Application configuration schema
 */
declare const AppConfigSchema: z.ZodObject<{
    name: z.ZodString;
    url: z.ZodString;
    port: z.ZodNumber;
    nodeEnv: z.ZodDefault<z.ZodEnum<{
        development: "development";
        production: "production";
        test: "test";
        staging: "staging";
    }>>;
    corsOrigin: z.ZodDefault<z.ZodString>;
    frontendUrl: z.ZodString;
    rateLimitMax: z.ZodDefault<z.ZodNumber>;
    rateLimitTtl: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
/**
 * Admin panel configuration schema
 */
declare const AdminConfigSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    allowedIps: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
/**
 * Email service configuration schema
 */
declare const EmailConfigSchema: z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    from: z.ZodString;
    brevoApiKey: z.ZodOptional<z.ZodString>;
    smtp: z.ZodOptional<z.ZodObject<{
        host: z.ZodString;
        port: z.ZodNumber;
        secure: z.ZodDefault<z.ZodBoolean>;
        auth: z.ZodObject<{
            user: z.ZodString;
            pass: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * S3-compatible storage configuration schema
 */
declare const S3ConfigSchema: z.ZodObject<{
    endpoint: z.ZodString;
    port: z.ZodNumber;
    useSSL: z.ZodDefault<z.ZodBoolean>;
    region: z.ZodString;
    accessKey: z.ZodString;
    secretKey: z.ZodString;
    bucketName: z.ZodString;
}, z.core.$strip>;
/**
 * RabbitMQ message queue configuration schema
 */
declare const RabbitMQConfigSchema: z.ZodObject<{
    uri: z.ZodString;
    exchange: z.ZodString;
    dlxExchange: z.ZodString;
    connectionInitOptions: z.ZodOptional<z.ZodObject<{
        wait: z.ZodDefault<z.ZodBoolean>;
        timeout: z.ZodDefault<z.ZodNumber>;
        reject: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Logging configuration schema
 */
declare const LoggingConfigSchema: z.ZodObject<{
    level: z.ZodDefault<z.ZodEnum<{
        error: "error";
        debug: "debug";
        info: "info";
        warn: "warn";
    }>>;
    format: z.ZodDefault<z.ZodEnum<{
        json: "json";
        pretty: "pretty";
    }>>;
    transports: z.ZodDefault<z.ZodArray<z.ZodEnum<{
        file: "file";
        console: "console";
    }>>>;
    fileConfig: z.ZodOptional<z.ZodObject<{
        filename: z.ZodString;
        maxSize: z.ZodDefault<z.ZodString>;
        maxFiles: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Feature flags configuration schema
 */
declare const FeatureFlagsConfigSchema: z.ZodObject<{
    enableNewUI: z.ZodDefault<z.ZodBoolean>;
    enableBetaFeatures: z.ZodDefault<z.ZodBoolean>;
    enableAnalytics: z.ZodDefault<z.ZodBoolean>;
    maintenanceMode: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
/**
 * Complete application configuration schema
 * Core sections (app, database, auth) are required
 * Optional sections can be selectively included using the builder
 */
declare const ConfigurationSchema: z.ZodObject<{
    app: z.ZodObject<{
        name: z.ZodString;
        url: z.ZodString;
        port: z.ZodNumber;
        nodeEnv: z.ZodDefault<z.ZodEnum<{
            development: "development";
            production: "production";
            test: "test";
            staging: "staging";
        }>>;
        corsOrigin: z.ZodDefault<z.ZodString>;
        frontendUrl: z.ZodString;
        rateLimitMax: z.ZodDefault<z.ZodNumber>;
        rateLimitTtl: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>;
    database: z.ZodObject<{
        type: z.ZodDefault<z.ZodLiteral<"postgres">>;
        host: z.ZodString;
        port: z.ZodNumber;
        username: z.ZodString;
        password: z.ZodString;
        database: z.ZodString;
        synchronize: z.ZodDefault<z.ZodBoolean>;
        dropSchema: z.ZodOptional<z.ZodBoolean>;
        logging: z.ZodDefault<z.ZodBoolean>;
        ssl: z.ZodOptional<z.ZodBoolean>;
        autoLoadEntities: z.ZodDefault<z.ZodBoolean>;
        migrationsRun: z.ZodDefault<z.ZodBoolean>;
        rlsEnabled: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>;
    auth: z.ZodObject<{
        jwtSecret: z.ZodString;
        jwtRefreshSecret: z.ZodString;
        jwtExpiresIn: z.ZodDefault<z.ZodString>;
        jwtRefreshExpiresIn: z.ZodDefault<z.ZodString>;
        bcryptRounds: z.ZodDefault<z.ZodNumber>;
        maxFailedAttempts: z.ZodDefault<z.ZodNumber>;
        lockoutDurationMinutes: z.ZodDefault<z.ZodNumber>;
        google: z.ZodOptional<z.ZodObject<{
            clientId: z.ZodString;
            clientSecret: z.ZodString;
        }, z.core.$strip>>;
        github: z.ZodOptional<z.ZodObject<{
            clientId: z.ZodString;
            clientSecret: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    redis: z.ZodOptional<z.ZodObject<{
        host: z.ZodString;
        port: z.ZodNumber;
        password: z.ZodOptional<z.ZodString>;
        db: z.ZodDefault<z.ZodNumber>;
        ttl: z.ZodDefault<z.ZodNumber>;
        keyPrefix: z.ZodDefault<z.ZodString>;
    }, z.core.$strip>>;
    admin: z.ZodOptional<z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
        allowedIps: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
    email: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        from: z.ZodString;
        brevoApiKey: z.ZodOptional<z.ZodString>;
        smtp: z.ZodOptional<z.ZodObject<{
            host: z.ZodString;
            port: z.ZodNumber;
            secure: z.ZodDefault<z.ZodBoolean>;
            auth: z.ZodObject<{
                user: z.ZodString;
                pass: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    s3: z.ZodOptional<z.ZodObject<{
        endpoint: z.ZodString;
        port: z.ZodNumber;
        useSSL: z.ZodDefault<z.ZodBoolean>;
        region: z.ZodString;
        accessKey: z.ZodString;
        secretKey: z.ZodString;
        bucketName: z.ZodString;
    }, z.core.$strip>>;
    rabbitmq: z.ZodOptional<z.ZodObject<{
        uri: z.ZodString;
        exchange: z.ZodString;
        dlxExchange: z.ZodString;
        connectionInitOptions: z.ZodOptional<z.ZodObject<{
            wait: z.ZodDefault<z.ZodBoolean>;
            timeout: z.ZodDefault<z.ZodNumber>;
            reject: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    logging: z.ZodOptional<z.ZodObject<{
        level: z.ZodDefault<z.ZodEnum<{
            error: "error";
            debug: "debug";
            info: "info";
            warn: "warn";
        }>>;
        format: z.ZodDefault<z.ZodEnum<{
            json: "json";
            pretty: "pretty";
        }>>;
        transports: z.ZodDefault<z.ZodArray<z.ZodEnum<{
            file: "file";
            console: "console";
        }>>>;
        fileConfig: z.ZodOptional<z.ZodObject<{
            filename: z.ZodString;
            maxSize: z.ZodDefault<z.ZodString>;
            maxFiles: z.ZodDefault<z.ZodNumber>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    featureFlags: z.ZodOptional<z.ZodObject<{
        enableNewUI: z.ZodDefault<z.ZodBoolean>;
        enableBetaFeatures: z.ZodDefault<z.ZodBoolean>;
        enableAnalytics: z.ZodDefault<z.ZodBoolean>;
        maintenanceMode: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
}, z.core.$strip>;

/**
 * Configuration types derived from Zod schemas
 * DO NOT manually define interfaces - types are inferred from schemas
 */
type DatabaseConfig = z.infer<typeof DatabaseConfigSchema>;
type OAuthProvider = z.infer<typeof OAuthProviderSchema>;
type AuthConfig = z.infer<typeof AuthConfigSchema>;
type RedisConfig = z.infer<typeof RedisConfigSchema>;
type AppConfig = z.infer<typeof AppConfigSchema>;
type AdminConfig = z.infer<typeof AdminConfigSchema>;
type EmailConfig = z.infer<typeof EmailConfigSchema>;
type S3Config = z.infer<typeof S3ConfigSchema>;
type RabbitMQConfig = z.infer<typeof RabbitMQConfigSchema>;
type LoggingConfig = z.infer<typeof LoggingConfigSchema>;
type FeatureFlagsConfig = z.infer<typeof FeatureFlagsConfigSchema>;
/**
 * Complete application configuration type
 */
type Configuration = z.infer<typeof ConfigurationSchema>;
/**
 * Deep partial helper type
 */
type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
/**
 * Partial configuration for builder pattern
 */
type PartialConfiguration = DeepPartial<Configuration>;

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
declare function toEnvVarName(path: string, prefix: string): string;
/**
 * Loads a value from environment variables with automatic type parsing
 * Handles strings, numbers, booleans, and arrays
 */
declare function loadEnvValue(envVarName: string, defaultValue?: any, type?: 'string' | 'number' | 'boolean' | 'array'): any;
/**
 * Type for custom environment loaders
 */
type CustomEnvLoader<T = any> = (prefix: string) => T;
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
declare function createSimpleEnvLoader<T extends Record<string, any>>(mapping: T): CustomEnvLoader<T>;
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
declare function createNestedEnvLoader<T extends Record<string, any>>(mapping: T): CustomEnvLoader<T>;
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
declare function createStaticLoader<T>(config: T): CustomEnvLoader<T>;
/**
 * Type for loader input - can be a prefix string, loader function, or static config
 */
type LoaderInput<T> = string | CustomEnvLoader<T> | T;
/**
 * Normalizes loader input into a loader function
 * - If string: treats as prefix and requires explicit loader
 * - If function: uses as-is
 * - If object: creates static loader
 */
declare function normalizeLoader<T>(input: LoaderInput<T>, defaultMapping?: T): CustomEnvLoader<T>;

/**
 * Fluent configuration builder
 * Helps construct configuration objects in a type-safe, chainable way
 *
 * @example
 * // Selective loading (new approach)
 * const config = createConfigBuilder()
 *   .fromDotEnv()
 *   .app()
 *   .database()
 *   .s3()
 *   .addCustom('myService', schema, 'MY_SERVICE_')
 *   .build();
 *
 * @example
 * // Load all sections (backward compatible)
 * const config = createConfigBuilder()
 *   .fromEnv()
 *   .build();
 */
declare class ConfigBuilder {
    private config;
    private enabledSections;
    private customSections;
    private envPrefix;
    /**
     * Set environment (development, staging, production, test)
     */
    environment(env: AppConfig['nodeEnv']): this;
    /**
     * Enable and load application settings section
     * @param config - Optional config override (if not provided, loads from env)
     */
    app(config?: Partial<AppConfig>): this;
    /**
     * Enable and load database configuration section
     * @param config - Optional config override (if not provided, loads from env)
     */
    database(config?: Partial<DatabaseConfig>): this;
    /**
     * Enable and load authentication configuration section
     * @param config - Optional config override (if not provided, loads from env)
     */
    auth(config?: Partial<AuthConfig>): this;
    /**
     * Enable and load Redis cache configuration section
     * @param config - Optional config override (if not provided, loads from env)
     */
    redis(config?: Partial<RedisConfig>): this;
    /**
     * Enable and load admin panel configuration section
     * @param config - Optional config override (if not provided, loads from env)
     */
    admin(config?: Partial<AdminConfig>): this;
    /**
     * Enable and load email service configuration section
     * @param config - Optional config override (if not provided, loads from env)
     */
    email(config?: Partial<EmailConfig>): this;
    /**
     * Enable and load S3 storage configuration section
     * @param config - Optional config override (if not provided, loads from env)
     */
    s3(config?: Partial<S3Config>): this;
    /**
     * Enable and load RabbitMQ configuration section
     * @param config - Optional config override (if not provided, loads from env)
     */
    rabbitmq(config?: Partial<RabbitMQConfig>): this;
    /**
     * Enable and load logging configuration section
     * @param config - Optional config override (if not provided, loads from env)
     */
    logging(config?: Partial<LoggingConfig>): this;
    /**
     * Enable and load feature flags configuration section
     * @param config - Optional config override (if not provided, loads from env)
     */
    featureFlags(config?: Partial<FeatureFlagsConfig>): this;
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
    fromDotEnv(envFilePath?: string, prefix?: string, override?: boolean): this;
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
    fromEnv(prefix?: string): this;
    /**
     * Load configuration from a JSON file
     * @param filePath - Path to JSON config file
     */
    fromFile(filePath: string): this;
    /**
     * Load test configuration preset
     */
    fromTest(): this;
    /**
     * Merge with another configuration object
     * @param config - Configuration to merge
     */
    merge(config: PartialConfiguration): this;
    /**
     * Override specific values (alias for merge)
     * @param config - Configuration to override
     */
    override(config: PartialConfiguration): this;
    /**
     * Use a preset configuration (development, production, test, staging)
     * @param preset - Preset name
     */
    preset(preset: 'development' | 'production' | 'test' | 'staging'): this;
    /**
     * Conditionally apply configuration
     * @param condition - Boolean condition
     * @param fn - Function to apply if condition is true
     */
    when(condition: boolean, fn: (builder: ConfigBuilder) => void): this;
    /**
     * Conditionally apply configuration based on environment
     * @param env - Environment to check
     * @param fn - Function to apply if environment matches
     */
    whenEnv(env: AppConfig['nodeEnv'], fn: (builder: ConfigBuilder) => void): this;
    /**
     * Enable development mode optimizations
     */
    forDevelopment(): this;
    /**
     * Enable production mode optimizations
     */
    forProduction(): this;
    /**
     * Enable test mode optimizations
     */
    forTest(): this;
    /**
     * Enable staging mode optimizations
     */
    forStaging(): this;
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
    addCustom<T = any>(name: string, schema: ZodType, loaderOrConfig?: LoaderInput<T>): this;
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
    build<T = Configuration>(): T;
    /**
     * Build without validation (unsafe, use for debugging)
     * @returns Partial configuration without validation
     */
    buildUnsafe(): PartialConfiguration;
    /**
     * Get current config state (for inspection)
     * @returns Copy of current configuration state
     */
    peek(): PartialConfiguration;
    /**
     * Reset builder to empty state
     */
    reset(): this;
    /**
     * Clone the current builder state
     * @returns New builder with same configuration
     */
    clone(): ConfigBuilder;
}
/**
 * Create a new config builder instance
 * @returns New ConfigBuilder instance
 */
declare function createConfigBuilder(): ConfigBuilder;
/**
 * Quick helper to create config from .env file
 * @param envFilePath - Path to .env file (defaults to .env in current directory)
 * @param prefix - Optional prefix for environment variables
 * @param override - Whether to override existing environment variables
 * @returns Validated configuration
 */
declare function createConfigFromDotEnv<T = Configuration>(envFilePath?: string, prefix?: string, override?: boolean): T;
/**
 * Quick helper to create config from environment
 * @param prefix - Optional prefix for environment variables
 * @returns Validated configuration
 */
declare function createConfigFromEnv<T = Configuration>(prefix?: string): T;
/**
 * Quick helper to create config from preset
 * @param preset - Preset name
 * @param overrides - Optional configuration overrides
 * @returns Validated configuration
 */
declare function createConfigFromPreset<T = Configuration>(preset: 'development' | 'production' | 'test' | 'staging', overrides?: PartialConfiguration): T;
/**
 * Quick helper to create test configuration
 * @template T - The final configuration type (defaults to Configuration)
 * @returns Validated test configuration
 */
declare function createTestConfig<T = Configuration>(): T;

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
declare function loadDotEnv(envFilePath?: string, override?: boolean): void;
/**
 * Load app configuration from environment variables
 * @param prefix - Optional prefix for environment variables
 */
declare function loadAppFromEnv(prefix?: string): {
    name: string;
    url: string;
    frontendUrl: string;
    port: number;
    nodeEnv: any;
    corsOrigin: string;
    rateLimitMax: number;
    rateLimitTtl: number;
};
/**
 * Load database configuration from environment variables
 * @param prefix - Optional prefix for environment variables
 */
declare function loadDatabaseFromEnv(prefix?: string): {
    type: "postgres";
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    synchronize: boolean;
    dropSchema: boolean;
    logging: boolean;
    ssl: boolean;
    autoLoadEntities: boolean;
    migrationsRun: boolean;
    rlsEnabled: boolean;
};
/**
 * Load authentication configuration from environment variables
 * @param prefix - Optional prefix for environment variables
 */
declare function loadAuthFromEnv(prefix?: string): {
    github?: {
        clientId: string;
        clientSecret: string;
    } | undefined;
    google?: {
        clientId: string;
        clientSecret: string;
    } | undefined;
    jwtSecret: string;
    jwtRefreshSecret: string;
    jwtExpiresIn: string;
    jwtRefreshExpiresIn: string;
    bcryptRounds: number;
    maxFailedAttempts: number;
    lockoutDurationMinutes: number;
};
/**
 * Load Redis configuration from environment variables
 * @param prefix - Optional prefix for environment variables
 */
declare function loadRedisFromEnv(prefix?: string): {
    host: string;
    port: number;
    password: string | undefined;
    db: number;
    ttl: number;
    keyPrefix: string;
};
/**
 * Load admin configuration from environment variables
 * @param prefix - Optional prefix for environment variables
 */
declare function loadAdminFromEnv(prefix?: string): {
    email: string;
    password: string;
    allowedIps: string[] | undefined;
};
/**
 * Load email configuration from environment variables
 * @param prefix - Optional prefix for environment variables
 */
declare function loadEmailFromEnv(prefix?: string): {
    smtp?: {
        host: string;
        port: number;
        secure: boolean;
        auth: {
            user: string;
            pass: string;
        };
    } | undefined;
    enabled: boolean;
    from: string;
    brevoApiKey: string | undefined;
};
/**
 * Load S3 configuration from environment variables
 * @param prefix - Optional prefix for environment variables
 */
declare function loadS3FromEnv(prefix?: string): {
    endpoint: string;
    port: number;
    useSSL: boolean;
    region: string;
    accessKey: string;
    secretKey: string;
    bucketName: string;
};
/**
 * Load RabbitMQ configuration from environment variables
 * @param prefix - Optional prefix for environment variables
 */
declare function loadRabbitMQFromEnv(prefix?: string): {
    uri: string;
    exchange: string;
    dlxExchange: string;
    connectionInitOptions: {
        wait: boolean;
        timeout: number;
        reject: boolean;
    };
};
/**
 * Load logging configuration from environment variables
 * @param prefix - Optional prefix for environment variables
 */
declare function loadLoggingFromEnv(prefix?: string): {
    fileConfig?: {
        filename: string;
        maxSize: string;
        maxFiles: number;
    } | undefined;
    level: any;
    format: any;
    transports: any;
};
/**
 * Load feature flags configuration from environment variables
 * @param prefix - Optional prefix for environment variables
 */
declare function loadFeatureFlagsFromEnv(prefix?: string): {
    enableNewUI: boolean;
    enableBetaFeatures: boolean;
    enableAnalytics: boolean;
    maintenanceMode: boolean;
};
/**
 * Load configuration from environment variables (all sections)
 * @param prefix - Optional prefix for environment variables (e.g., 'APP_')
 * @returns Partial configuration loaded from environment
 */
declare function loadFromEnv(prefix?: string): PartialConfiguration;
/**
 * Load configuration from a JSON file
 * @param filePath - Path to JSON config file
 * @returns Partial configuration loaded from file
 */
declare function loadFromFile(filePath: string): PartialConfiguration;
/**
 * Load minimal configuration for testing
 * @returns Minimal configuration for test environment
 */
declare function loadTestConfig(): PartialConfiguration;

/**
 * Validation utilities for configuration
 */
/**
 * Validate configuration against schema
 * @param config - Configuration object to validate
 * @returns Validated and typed configuration
 * @throws Error if validation fails with detailed error messages
 */
declare function validateConfig(config: unknown): Configuration;
/**
 * Validate configuration and return result with errors
 * Non-throwing version for safer validation
 * @param config - Configuration object to validate
 * @returns Validation result with success flag and data or errors
 */
declare function safeValidateConfig(config: unknown): {
    success: boolean;
    data?: Configuration;
    errors?: string[];
};
/**
 * Validate partial configuration (for builder pattern)
 * @param config - Partial configuration object
 * @returns True if valid structure, throws on invalid
 */
declare function validatePartialConfig(config: PartialConfiguration): boolean;
/**
 * Log configuration in a safe way (with secrets masked)
 * @param config - Configuration object to log
 * @param logger - Optional logger function (defaults to console.log)
 */
declare function logConfigSafely(config: Configuration, logger?: (msg: string) => void): void;
/**
 * Get configuration summary for logging (minimal info, no secrets)
 * @param config - Configuration object
 * @returns Safe summary object
 */
declare function getConfigSummary(config: Configuration): Record<string, any>;

/**
 * Utility functions for configuration management
 */
/**
 * Deep merge two objects
 * @param target - Target object
 * @param source - Source object to merge
 * @returns Merged object
 */
declare function deepMerge<T = any>(target: any, source: any): T;
/**
 * Mask sensitive values for safe logging
 * Redacts passwords, secrets, keys, and tokens
 * @param config - Configuration object to mask
 * @returns Configuration object with sensitive values masked
 */
declare function maskSecrets(config: any): any;
/**
 * Parse string boolean values
 * @param value - String value to parse
 * @param defaultValue - Default value if parsing fails
 * @returns Boolean value
 */
declare function parseBoolean(value: string | undefined, defaultValue?: boolean): boolean;
/**
 * Parse string number values
 * @param value - String value to parse
 * @param defaultValue - Default value if parsing fails
 * @returns Number value
 */
declare function parseNumber(value: string | undefined, defaultValue: number): number;
/**
 * Parse comma-separated string values into array
 * @param value - String value to parse
 * @param defaultValue - Default value if parsing fails
 * @returns Array of strings
 */
declare function parseArray(value: string | undefined, defaultValue?: string[]): string[];
/**
 * Get required environment variable or throw error
 * @param key - Environment variable key
 * @param errorMessage - Custom error message
 * @returns Environment variable value
 * @throws Error if environment variable is not set
 */
declare function requireEnv(key: string, errorMessage?: string): string;
/**
 * Get optional environment variable with default value
 * @param key - Environment variable key
 * @param defaultValue - Default value
 * @returns Environment variable value or default
 */
declare function getEnv(key: string, defaultValue: string): string;
/**
 * Validate production secrets
 * Ensures critical secrets meet security requirements in production
 * @param config - Configuration object
 * @throws Error if validation fails
 */
declare function validateProductionSecrets(config: any): void;

/**
 * Default/preset configurations
 * These are OPTIONAL reference configurations that consuming projects can use
 * They are NOT automatically applied - projects must explicitly use them
 */
/**
 * Development environment preset
 * Optimized for local development with verbose logging and auto-sync
 */
declare const DEVELOPMENT_PRESET: PartialConfiguration;
/**
 * Production environment preset
 * Optimized for production with security and performance
 */
declare const PRODUCTION_PRESET: PartialConfiguration;
/**
 * Staging environment preset
 * Similar to production but with more debugging enabled
 */
declare const STAGING_PRESET: PartialConfiguration;
/**
 * Test environment preset
 * Optimized for running tests with fast setup and teardown
 */
declare const TEST_PRESET: PartialConfiguration;
/**
 * Get preset configuration by name
 * @param preset - Preset name
 * @returns Partial configuration for the preset
 */
declare function getPreset(preset: 'development' | 'production' | 'staging' | 'test'): PartialConfiguration;
/**
 * Default database configuration values (for reference)
 */
declare const DEFAULT_DATABASE_CONFIG: {
    type: "postgres";
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    synchronize: boolean;
    logging: boolean;
    autoLoadEntities: boolean;
    migrationsRun: boolean;
    rlsEnabled: boolean;
};
/**
 * Default Redis configuration values (for reference)
 */
declare const DEFAULT_REDIS_CONFIG: {
    host: string;
    port: number;
    db: number;
    ttl: number;
    keyPrefix: string;
};
/**
 * Default JWT configuration values (for reference)
 */
declare const DEFAULT_JWT_CONFIG: {
    jwtExpiresIn: string;
    jwtRefreshExpiresIn: string;
    bcryptRounds: number;
    maxFailedAttempts: number;
    lockoutDurationMinutes: number;
};
/**
 * Default rate limiting configuration (for reference)
 */
declare const DEFAULT_RATE_LIMIT: {
    max: number;
    ttl: number;
};
/**
 * Default logging configuration (for reference)
 */
declare const DEFAULT_LOGGING_CONFIG: {
    level: "info";
    format: "json";
    transports: readonly ["console"];
};

export { type AdminConfig, AdminConfigSchema, type AppConfig, AppConfigSchema, type AuthConfig, AuthConfigSchema, ConfigBuilder, type Configuration, ConfigurationSchema, type CustomEnvLoader, DEFAULT_DATABASE_CONFIG, DEFAULT_JWT_CONFIG, DEFAULT_LOGGING_CONFIG, DEFAULT_RATE_LIMIT, DEFAULT_REDIS_CONFIG, DEVELOPMENT_PRESET, type DatabaseConfig, DatabaseConfigSchema, type EmailConfig, EmailConfigSchema, type FeatureFlagsConfig, FeatureFlagsConfigSchema, type LoaderInput, type LoggingConfig, LoggingConfigSchema, type OAuthProvider, OAuthProviderSchema, PRODUCTION_PRESET, type PartialConfiguration, type RabbitMQConfig, RabbitMQConfigSchema, type RedisConfig, RedisConfigSchema, type S3Config, S3ConfigSchema, STAGING_PRESET, TEST_PRESET, createConfigBuilder, createConfigFromDotEnv, createConfigFromEnv, createConfigFromPreset, createNestedEnvLoader, createSimpleEnvLoader, createStaticLoader, createTestConfig, deepMerge, getConfigSummary, getEnv, getPreset, loadAdminFromEnv, loadAppFromEnv, loadAuthFromEnv, loadDatabaseFromEnv, loadDotEnv, loadEmailFromEnv, loadEnvValue, loadFeatureFlagsFromEnv, loadFromEnv, loadFromFile, loadLoggingFromEnv, loadRabbitMQFromEnv, loadRedisFromEnv, loadS3FromEnv, loadTestConfig, logConfigSafely, maskSecrets, normalizeLoader, parseArray, parseBoolean, parseNumber, requireEnv, safeValidateConfig, toEnvVarName, validateConfig, validatePartialConfig, validateProductionSecrets };
