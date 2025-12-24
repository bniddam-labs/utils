import { z, type ZodType } from 'zod';
import type { CustomEnvLoader, LoaderInput } from './custom.js';
import { getPreset } from './defaults.js';
import {
	loadAdminFromEnv,
	loadAppFromEnv,
	loadAuthFromEnv,
	loadDatabaseFromEnv,
	loadDotEnv,
	loadEmailFromEnv,
	loadFeatureFlagsFromEnv,
	loadFromEnv,
	loadFromFile,
	loadLoggingFromEnv,
	loadRabbitMQFromEnv,
	loadRedisFromEnv,
	loadS3FromEnv,
	loadTestConfig,
} from './loaders.js';
import {
	AdminConfigSchema,
	AppConfigSchema,
	AuthConfigSchema,
	DatabaseConfigSchema,
	EmailConfigSchema,
	FeatureFlagsConfigSchema,
	LoggingConfigSchema,
	RabbitMQConfigSchema,
	RedisConfigSchema,
	S3ConfigSchema,
} from './schema.js';
import type {
	AdminConfig,
	AppConfig,
	AuthConfig,
	Configuration,
	DatabaseConfig,
	EmailConfig,
	FeatureFlagsConfig,
	LoggingConfig,
	PartialConfiguration,
	RabbitMQConfig,
	RedisConfig,
	S3Config,
} from './types.js';
import { deepMerge } from './utils.js';
import { validateConfig } from './validators.js';

/**
 * Custom section definition
 */
interface CustomSection<T = any> {
	schema: z.ZodType<T>;
	config: any;
}

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
export class ConfigBuilder {
	private config: PartialConfiguration = {};
	private enabledSections = new Set<string>();
	private customSections = new Map<string, CustomSection>();
	private envPrefix = '';

	/**
	 * Set environment (development, staging, production, test)
	 */
	environment(env: AppConfig['nodeEnv']): this {
		this.config.app ??= {};
		this.config.app.nodeEnv = env;
		return this;
	}

	/**
	 * Enable and load application settings section
	 * @param config - Optional config override (if not provided, loads from env)
	 */
	app(config?: Partial<AppConfig>): this {
		this.enabledSections.add('app');
		const envConfig = config ?? loadAppFromEnv(this.envPrefix);
		this.config.app = deepMerge(this.config.app || {}, envConfig);
		return this;
	}

	/**
	 * Enable and load database configuration section
	 * @param config - Optional config override (if not provided, loads from env)
	 */
	database(config?: Partial<DatabaseConfig>): this {
		this.enabledSections.add('database');
		const envConfig = config ?? loadDatabaseFromEnv(this.envPrefix);
		this.config.database = deepMerge(this.config.database || {}, envConfig);
		return this;
	}

	/**
	 * Enable and load authentication configuration section
	 * @param config - Optional config override (if not provided, loads from env)
	 */
	auth(config?: Partial<AuthConfig>): this {
		this.enabledSections.add('auth');
		const envConfig = config ?? loadAuthFromEnv(this.envPrefix);
		this.config.auth = deepMerge(this.config.auth || {}, envConfig);
		return this;
	}

	/**
	 * Enable and load Redis cache configuration section
	 * @param config - Optional config override (if not provided, loads from env)
	 */
	redis(config?: Partial<RedisConfig>): this {
		this.enabledSections.add('redis');
		const envConfig = config ?? loadRedisFromEnv(this.envPrefix);
		this.config.redis = deepMerge(this.config.redis || {}, envConfig);
		return this;
	}

	/**
	 * Enable and load admin panel configuration section
	 * @param config - Optional config override (if not provided, loads from env)
	 */
	admin(config?: Partial<AdminConfig>): this {
		this.enabledSections.add('admin');
		const envConfig = config ?? loadAdminFromEnv(this.envPrefix);
		this.config.admin = deepMerge(this.config.admin || {}, envConfig);
		return this;
	}

	/**
	 * Enable and load email service configuration section
	 * @param config - Optional config override (if not provided, loads from env)
	 */
	email(config?: Partial<EmailConfig>): this {
		this.enabledSections.add('email');
		const envConfig = config ?? loadEmailFromEnv(this.envPrefix);
		this.config.email = deepMerge(this.config.email || {}, envConfig);
		return this;
	}

	/**
	 * Enable and load S3 storage configuration section
	 * @param config - Optional config override (if not provided, loads from env)
	 */
	s3(config?: Partial<S3Config>): this {
		this.enabledSections.add('s3');
		const envConfig = config ?? loadS3FromEnv(this.envPrefix);
		this.config.s3 = deepMerge(this.config.s3 || {}, envConfig);
		return this;
	}

	/**
	 * Enable and load RabbitMQ configuration section
	 * @param config - Optional config override (if not provided, loads from env)
	 */
	rabbitmq(config?: Partial<RabbitMQConfig>): this {
		this.enabledSections.add('rabbitmq');
		const envConfig = config ?? loadRabbitMQFromEnv(this.envPrefix);
		this.config.rabbitmq = deepMerge(this.config.rabbitmq || {}, envConfig);
		return this;
	}

	/**
	 * Enable and load logging configuration section
	 * @param config - Optional config override (if not provided, loads from env)
	 */
	logging(config?: Partial<LoggingConfig>): this {
		this.enabledSections.add('logging');
		const envConfig = config ?? loadLoggingFromEnv(this.envPrefix);
		this.config.logging = deepMerge(this.config.logging || {}, envConfig);
		return this;
	}

	/**
	 * Enable and load feature flags configuration section
	 * @param config - Optional config override (if not provided, loads from env)
	 */
	featureFlags(config?: Partial<FeatureFlagsConfig>): this {
		this.enabledSections.add('featureFlags');
		const envConfig = config ?? loadFeatureFlagsFromEnv(this.envPrefix);
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
	fromDotEnv(envFilePath = '.env', prefix = '', override = false): this {
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
	fromEnv(prefix = ''): this {
		this.envPrefix = prefix;
		const envConfig = loadFromEnv(prefix);
		this.config = deepMerge(this.config, envConfig);

		// Enable all core sections
		this.enabledSections.add('app');
		this.enabledSections.add('database');
		this.enabledSections.add('auth');
		this.enabledSections.add('redis');
		this.enabledSections.add('admin');
		this.enabledSections.add('email');
		this.enabledSections.add('s3');
		this.enabledSections.add('rabbitmq');
		this.enabledSections.add('logging');
		this.enabledSections.add('featureFlags');

		return this;
	}

	/**
	 * Load configuration from a JSON file
	 * @param filePath - Path to JSON config file
	 */
	fromFile(filePath: string): this {
		const fileConfig = loadFromFile(filePath);
		this.config = deepMerge(this.config, fileConfig);
		return this;
	}

	/**
	 * Load test configuration preset
	 */
	fromTest(): this {
		const testConfig = loadTestConfig();
		this.config = deepMerge(this.config, testConfig);
		return this;
	}

	/**
	 * Merge with another configuration object
	 * @param config - Configuration to merge
	 */
	merge(config: PartialConfiguration): this {
		this.config = deepMerge(this.config, config);
		return this;
	}

	/**
	 * Override specific values (alias for merge)
	 * @param config - Configuration to override
	 */
	override(config: PartialConfiguration): this {
		this.config = deepMerge(this.config, config);
		return this;
	}

	/**
	 * Use a preset configuration (development, production, test, staging)
	 * @param preset - Preset name
	 */
	preset(preset: 'development' | 'production' | 'test' | 'staging'): this {
		const presetConfig = getPreset(preset);
		this.config = deepMerge(this.config, presetConfig);
		return this;
	}

	/**
	 * Conditionally apply configuration
	 * @param condition - Boolean condition
	 * @param fn - Function to apply if condition is true
	 */
	when(condition: boolean, fn: (builder: ConfigBuilder) => void): this {
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
	whenEnv(env: AppConfig['nodeEnv'], fn: (builder: ConfigBuilder) => void): this {
		if (this.config.app?.nodeEnv === env) {
			fn(this);
		}
		return this;
	}

	/**
	 * Enable development mode optimizations
	 */
	forDevelopment(): this {
		return this.preset('development');
	}

	/**
	 * Enable production mode optimizations
	 */
	forProduction(): this {
		return this.preset('production');
	}

	/**
	 * Enable test mode optimizations
	 */
	forTest(): this {
		return this.preset('test');
	}

	/**
	 * Enable staging mode optimizations
	 */
	forStaging(): this {
		return this.preset('staging');
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
	addCustom<T = any>(name: string, schema: ZodType, loaderOrConfig?: LoaderInput<T>): this {
		let configData: any;

		if (loaderOrConfig === undefined) {
			// No loader provided, use empty object
			configData = {};
		} else if (typeof loaderOrConfig === 'function') {
			// Function = custom loader
			const loader = loaderOrConfig as CustomEnvLoader<T>;
			// Auto-generate prefix from section name if not explicitly set
			// Convert camelCase to SCREAMING_SNAKE_CASE and add trailing underscore
			const autoPrefix =
				name
					.replace(/([A-Z])/g, '_$1')
					.toUpperCase()
					.replace(/^_/, '') + '_';
			const prefix = this.envPrefix || autoPrefix;
			configData = loader(prefix);
		} else {
			// Object = static config
			configData = loaderOrConfig;
		}

		// Store the custom section
		this.customSections.set(name, { schema, config: configData });

		// Add to config
		(this.config as any)[name] = deepMerge((this.config as any)[name] || {}, configData);

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
	build<T = Configuration>(): T {
		// If no sections are enabled, assume all sections (backward compatibility)
		const shouldEnableAll = this.enabledSections.size === 0 && this.customSections.size === 0;

		if (shouldEnableAll) {
			return validateConfig(this.config) as T;
		}

		// Build dynamic schema from enabled sections
		const schemaShape: Record<string, z.ZodTypeAny> = {};

		// Add enabled core sections
		if (this.enabledSections.has('app')) schemaShape.app = AppConfigSchema;
		if (this.enabledSections.has('database')) schemaShape.database = DatabaseConfigSchema;
		if (this.enabledSections.has('auth')) schemaShape.auth = AuthConfigSchema;
		if (this.enabledSections.has('redis')) schemaShape.redis = RedisConfigSchema;
		if (this.enabledSections.has('admin')) schemaShape.admin = AdminConfigSchema;
		if (this.enabledSections.has('email')) schemaShape.email = EmailConfigSchema;
		if (this.enabledSections.has('s3')) schemaShape.s3 = S3ConfigSchema;
		if (this.enabledSections.has('rabbitmq')) schemaShape.rabbitmq = RabbitMQConfigSchema;
		if (this.enabledSections.has('logging')) schemaShape.logging = LoggingConfigSchema;
		if (this.enabledSections.has('featureFlags')) schemaShape.featureFlags = FeatureFlagsConfigSchema;

		// Add custom sections
		for (const [name, { schema }] of this.customSections.entries()) {
			schemaShape[name] = schema;
		}

		// Create and validate against dynamic schema
		const dynamicSchema = z.object(schemaShape);
		const result = dynamicSchema.safeParse(this.config);

		if (!result.success) {
			const errors = result.error.issues.map((err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`);
			throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
		}

		return result.data as T;
	}

	/**
	 * Build without validation (unsafe, use for debugging)
	 * @returns Partial configuration without validation
	 */
	buildUnsafe(): PartialConfiguration {
		return this.config;
	}

	/**
	 * Get current config state (for inspection)
	 * @returns Copy of current configuration state
	 */
	peek(): PartialConfiguration {
		return { ...this.config };
	}

	/**
	 * Reset builder to empty state
	 */
	reset(): this {
		this.config = {};
		return this;
	}

	/**
	 * Clone the current builder state
	 * @returns New builder with same configuration
	 */
	clone(): ConfigBuilder {
		const newBuilder = new ConfigBuilder();
		newBuilder.config = { ...this.config };
		return newBuilder;
	}
}

/**
 * Create a new config builder instance
 * @returns New ConfigBuilder instance
 */
export function createConfigBuilder(): ConfigBuilder {
	return new ConfigBuilder();
}

/**
 * Quick helper to create config from .env file
 * @param envFilePath - Path to .env file (defaults to .env in current directory)
 * @param prefix - Optional prefix for environment variables
 * @param override - Whether to override existing environment variables
 * @returns Validated configuration
 */
export function createConfigFromDotEnv<T = Configuration>(envFilePath = '.env', prefix = '', override = false): T {
	return createConfigBuilder().fromDotEnv(envFilePath, prefix, override).build<T>();
}

/**
 * Quick helper to create config from environment
 * @param prefix - Optional prefix for environment variables
 * @returns Validated configuration
 */
export function createConfigFromEnv<T = Configuration>(prefix = ''): T {
	return createConfigBuilder().fromEnv(prefix).build<T>();
}

/**
 * Quick helper to create config from preset
 * @param preset - Preset name
 * @param overrides - Optional configuration overrides
 * @returns Validated configuration
 */
export function createConfigFromPreset<T = Configuration>(preset: 'development' | 'production' | 'test' | 'staging', overrides?: PartialConfiguration): T {
	const builder = createConfigBuilder().preset(preset);

	if (overrides) {
		builder.merge(overrides);
	}

	return builder.build<T>();
}

/**
 * Quick helper to create test configuration
 * @template T - The final configuration type (defaults to Configuration)
 * @returns Validated test configuration
 */
export function createTestConfig<T = Configuration>(): T {
	return createConfigBuilder().fromTest().build<T>();
}
