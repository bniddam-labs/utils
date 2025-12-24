/**
 * @saas/utils
 *
 * Framework-agnostic utility functions for the SaaS monorepo.
 * Pure TypeScript utilities with Zod validation support.
 *
 * ## Modules
 *
 * - **config**: Configuration management and environment variable handling
 * - **string**: String manipulation, sanitization, masking, and Zod schemas
 * - **result**: Type-safe error handling with Result type
 * - **validation**: Zod-based validation utilities
 */

export * from './config/index';
export * from './result/index';
export * from './string/index';
export * from './validation/index';
