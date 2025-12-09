/**
 * Result type utilities
 *
 * Type-safe error handling with Result<T, E> class, inspired by Rust.
 * Provides an alternative to exception-based error handling with method chaining support.
 *
 * @example
 * ```ts
 * import { Result } from '@bniddam-labs/utils/result';
 *
 * const result = Result.ok(5)
 *   .map(x => x * 2)
 *   .flatMap(x => Result.ok(x + 1))
 *   .tap(x => console.log('Value:', x))
 *   .unwrapOr(0);
 * ```
 */

export { Result } from './result.js';
