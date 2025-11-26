/**
 * @saas/utils
 *
 * Framework-agnostic utility functions for the SaaS monorepo.
 * Pure TypeScript utilities with Zod validation support.
 *
 * ## Modules
 *
 * - **pagination**: Pagination helpers and types with Zod schemas
 * - **id**: UUID validation and slug generation with Zod schemas
 * - **string**: String manipulation, sanitization, masking, and Zod schemas
 * - **result**: Type-safe error handling with Result type
 * - **validation**: Zod-based validation utilities
 */

export * from './pagination';
export * from './id';
export * from './string';
export * from './result';
export * from './validation';
