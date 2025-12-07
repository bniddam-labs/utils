/**
 * Result type for operations that can succeed or fail
 *
 * This is a type-safe alternative to throwing exceptions,
 * inspired by Rust's Result<T, E> type.
 */
/**
 * Success result
 */
interface Success<T> {
    success: true;
    data: T;
}
/**
 * Error result
 */
interface Failure<E = Error> {
    success: false;
    error: E;
}
/**
 * Result type that can be either Success or Failure
 */
type Result<T, E = Error> = Success<T> | Failure<E>;
/**
 * Create a success result
 *
 * @param data - Success data
 * @returns Success result
 *
 * @example
 * ```ts
 * const result = ok({ id: 1, name: 'John' });
 * // { success: true, data: { id: 1, name: 'John' } }
 * ```
 */
declare function ok<T>(data: T): Success<T>;
/**
 * Create an error result
 *
 * @param error - Error
 * @returns Error result
 *
 * @example
 * ```ts
 * const result = err(new Error('Not found'));
 * // { success: false, error: Error('Not found') }
 * ```
 */
declare function err<E = Error>(error: E): Failure<E>;
/**
 * Check if result is successful
 *
 * @param result - Result to check
 * @returns True if successful
 *
 * @example
 * ```ts
 * if (isOk(result)) {
 *   console.log(result.data);
 * }
 * ```
 */
declare function isOk<T, E>(result: Result<T, E>): result is Success<T>;
/**
 * Check if result is an error
 *
 * @param result - Result to check
 * @returns True if error
 *
 * @example
 * ```ts
 * if (isErr(result)) {
 *   console.error(result.error);
 * }
 * ```
 */
declare function isErr<T, E>(result: Result<T, E>): result is Failure<E>;
/**
 * Unwrap a successful result or throw an error
 *
 * @param result - Result to unwrap
 * @returns The data if successful
 * @throws Error if result is a failure
 *
 * @example
 * ```ts
 * const data = unwrap(result); // throws if error
 * ```
 */
declare function unwrap<T, E>(result: Result<T, E>): T;
/**
 * Unwrap a successful result or return a default value
 *
 * @param result - Result to unwrap
 * @param defaultValue - Default value if error
 * @returns The data if successful, otherwise default value
 *
 * @example
 * ```ts
 * const data = unwrapOr(result, []); // returns [] if error
 * ```
 */
declare function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T;
/**
 * Map a successful result to a new value
 *
 * @param result - Result to map
 * @param fn - Mapping function
 * @returns New result with mapped data
 *
 * @example
 * ```ts
 * const result = ok(5);
 * const doubled = map(result, x => x * 2); // ok(10)
 * ```
 */
declare function map<T, U, E>(result: Result<T, E>, fn: (data: T) => U): Result<U, E>;
/**
 * Map an error result to a new error
 *
 * @param result - Result to map
 * @param fn - Mapping function
 * @returns New result with mapped error
 *
 * @example
 * ```ts
 * const result = err('Not found');
 * const mapped = mapErr(result, e => new Error(e)); // err(Error('Not found'))
 * ```
 */
declare function mapErr<T, E, F>(result: Result<T, E>, fn: (error: E) => F): Result<T, F>;

export { type Failure, type Result, type Success, err, isErr, isOk, map, mapErr, ok, unwrap, unwrapOr };
