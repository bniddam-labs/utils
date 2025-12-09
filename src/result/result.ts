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
export class Result<T, E = Error> {
  private constructor(
    private readonly _success: boolean,
    private readonly _data?: T,
    private readonly _error?: E,
  ) {}

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
  static ok<T, E = Error>(data: T): Result<T, E> {
    return new Result<T, E>(true, data, undefined);
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
  static err<T = never, E = Error>(error: E): Result<T, E> {
    return new Result<T, E>(false, undefined, error);
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
  isOk(): this is Result<T, never> {
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
  isErr(): this is Result<never, E> {
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
  unwrap(): T {
    if (this.isOk()) {
      return this._data!;
    }
    throw this._error;
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
  unwrapOr(defaultValue: T): T {
    if (this.isOk()) {
      return this._data!;
    }
    return defaultValue;
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
  map<U>(fn: (data: T) => U): Result<U, E> {
    if (this.isOk()) {
      return Result.ok(fn(this._data!));
    }
    return Result.err(this._error!);
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
  mapErr<F>(fn: (error: E) => F): Result<T, F> {
    if (this.isErr()) {
      return Result.err(fn(this._error!));
    }
    return Result.ok(this._data!);
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
  flatMap<U>(fn: (data: T) => Result<U, E>): Result<U, E> {
    if (this.isOk()) {
      return fn(this._data!);
    }
    return Result.err(this._error!);
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
  andThen<U>(fn: (data: T) => Result<U, E>): Result<U, E> {
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
  orElse<F>(fn: (error: E) => Result<T, F>): Result<T, F> {
    if (this.isErr()) {
      return fn(this._error!);
    }
    return Result.ok(this._data!);
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
  match<U>(handlers: { ok: (data: T) => U; err: (error: E) => U }): U {
    if (this.isOk()) {
      return handlers.ok(this._data!);
    }
    return handlers.err(this._error!);
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
  tap(fn: (data: T) => void): Result<T, E> {
    if (this.isOk()) {
      fn(this._data!);
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
  inspect(fn: (data: T) => void): Result<T, E> {
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
  tapErr(fn: (error: E) => void): Result<T, E> {
    if (this.isErr()) {
      fn(this._error!);
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
  inspectErr(fn: (error: E) => void): Result<T, E> {
    return this.tapErr(fn);
  }
}
