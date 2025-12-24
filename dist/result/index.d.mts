/**
 * Result type for operations that can succeed or fail
 *
 * This is a type-safe alternative to throwing exceptions,
 * inspired by Rust's Result<T, E> type.
 *
 * @example
 * ```ts
 * // Create results
 * const success = Result.ok(42);
 * const failure = Result.err(new Error('Something went wrong'));
 *
 * // Chain operations
 * const result = Result.ok(5)
 *   .map(x => x * 2)
 *   .flatMap(x => Result.ok(x + 1))
 *   .tap(x => console.log('Success:', x))
 *   .match({
 *     ok: (data) => data,
 *     err: (error) => 0
 *   });
 * ```
 */
declare class Result<T, E = Error> {
    private readonly _success;
    private readonly _data?;
    private readonly _error?;
    private constructor();
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
    static ok<T, E = Error>(data: T): Result<T, E>;
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
    static err<T = never, E = Error>(error: E): Result<T, E>;
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
    isOk(): boolean;
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
    isErr(): boolean;
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
    unwrap(): T;
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
    unwrapErr(): E;
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
    unwrapOr(defaultValue: T): T;
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
    unwrapOrElse(fn: (error: E) => T): T;
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
    map<U>(fn: (data: T) => U): Result<U, E>;
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
    mapErr<F>(fn: (error: E) => F): Result<T, F>;
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
    flatMap<U>(fn: (data: T) => Result<U, E>): Result<U, E>;
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
    andThen<U>(fn: (data: T) => Result<U, E>): Result<U, E>;
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
    orElse<F>(fn: (error: E) => Result<T, F>): Result<T, F>;
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
    match<U>(handlers: {
        ok: (data: T) => U;
        err: (error: E) => U;
    }): U;
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
    tap(fn: (data: T) => void): Result<T, E>;
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
    inspect(fn: (data: T) => void): Result<T, E>;
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
    tapErr(fn: (error: E) => void): Result<T, E>;
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
    inspectErr(fn: (error: E) => void): Result<T, E>;
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
    static try<T, E = unknown>(fn: () => T, mapError?: (e: unknown) => E): Result<T, E>;
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
    static fromPromise<T, E = unknown>(p: Promise<T>, mapError?: (e: unknown) => E): Promise<Result<T, E>>;
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
    static all<T, E>(results: readonly Result<T, E>[]): Result<T[], E>;
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
    static traverse<A, T, E>(values: readonly A[], fn: (a: A) => Result<T, E>): Result<T[], E>;
}

export { Result };
