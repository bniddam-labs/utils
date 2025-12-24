import { z, ZodError } from 'zod';
import { ConfigurationSchema } from './schema.js';
import type { Configuration, PartialConfiguration } from './types.js';
import { maskSecrets, validateProductionSecrets } from './utils.js';

/**
 * Validation utilities for configuration
 */

/**
 * Validate configuration against schema
 * @param config - Configuration object to validate
 * @returns Validated and typed configuration
 * @throws Error if validation fails with detailed error messages
 */
export function validateConfig(config: unknown): Configuration {
	try {
		const validated = ConfigurationSchema.parse(config);

		// Additional production security validation
		validateProductionSecrets(validated);

		return validated;
	} catch (error) {
		if (error instanceof ZodError) {
			const errorMessages = error.issues.map((err: z.ZodIssue) => `  - ${err.path.join('.')}: ${err.message}`).join('\n');

			throw new Error(`Configuration validation failed:\n${errorMessages}`);
		}
		throw error;
	}
}

/**
 * Validate configuration and return result with errors
 * Non-throwing version for safer validation
 * @param config - Configuration object to validate
 * @returns Validation result with success flag and data or errors
 */
export function safeValidateConfig(config: unknown): {
	success: boolean;
	data?: Configuration;
	errors?: string[];
} {
	try {
		const validated = validateConfig(config);
		return {
			success: true,
			data: validated,
		};
	} catch (error) {
		if (error instanceof Error) {
			return {
				success: false,
				errors: error.message.split('\n').filter(Boolean),
			};
		}
		return {
			success: false,
			errors: ['Unknown validation error'],
		};
	}
}

/**
 * Validate partial configuration (for builder pattern)
 * @param config - Partial configuration object
 * @returns True if valid structure, throws on invalid
 */
export function validatePartialConfig(config: PartialConfiguration): boolean {
	// Partial validation - just check if structure is valid
	// Don't enforce required fields
	const result = ConfigurationSchema.partial().safeParse(config);

	if (!result.success) {
		const errorMessages = result.error.issues.map((err: z.ZodIssue) => `  - ${err.path.join('.')}: ${err.message}`).join('\n');

		throw new Error(`Partial configuration validation failed:\n${errorMessages}`);
	}

	return true;
}

/**
 * Log configuration in a safe way (with secrets masked)
 * @param config - Configuration object to log
 * @param logger - Optional logger function (defaults to console.log)
 */
export function logConfigSafely(config: Configuration, logger: (msg: string) => void = console.log): void {
	const masked = maskSecrets(config);
	logger(`Configuration loaded:\n${JSON.stringify(masked, null, 2)}`);
}

/**
 * Get configuration summary for logging (minimal info, no secrets)
 * @param config - Configuration object
 * @returns Safe summary object
 */
export function getConfigSummary(config: Configuration): Record<string, any> {
	return {
		environment: config.app.nodeEnv,
		appName: config.app.name,
		port: config.app.port,
		database: {
			host: config.database.host,
			port: config.database.port,
			database: config.database.database,
			ssl: config.database.ssl,
		},
		...(config.redis
			? {
					redis: {
						host: config.redis.host,
						port: config.redis.port,
						db: config.redis.db,
					},
			  }
			: {}),
		features: config.featureFlags,
		logging: config.logging,
	};
}
