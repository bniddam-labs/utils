/**
 * @saas/utils
 *
 * Framework-agnostic utility functions for the SaaS monorepo.
 * Pure TypeScript utilities with Zod validation support.
 *
 * ## Modules
 *
 * - **string**: String manipulation, sanitization, masking, and Zod schemas
 * - **result**: Type-safe error handling with Result type
 * - **validation**: Zod-based validation utilities
 */

export * from './string/index.js';
export * from './result/index.js';
export * from './validation/index.js';
