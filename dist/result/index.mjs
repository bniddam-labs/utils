// src/result/result.ts
var Result = class _Result {
  constructor(_success, _data, _error) {
    this._success = _success;
    this._data = _data;
    this._error = _error;
  }
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
  static ok(data) {
    return new _Result(true, data, void 0);
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
  static err(error) {
    return new _Result(false, void 0, error);
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
  isOk() {
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
  isErr() {
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
  unwrap() {
    if (this.isOk()) {
      return this._data;
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
  unwrapOr(defaultValue) {
    if (this.isOk()) {
      return this._data;
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
  map(fn) {
    if (this.isOk()) {
      return _Result.ok(fn(this._data));
    }
    return _Result.err(this._error);
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
  mapErr(fn) {
    if (this.isErr()) {
      return _Result.err(fn(this._error));
    }
    return _Result.ok(this._data);
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
  flatMap(fn) {
    if (this.isOk()) {
      return fn(this._data);
    }
    return _Result.err(this._error);
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
  andThen(fn) {
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
  orElse(fn) {
    if (this.isErr()) {
      return fn(this._error);
    }
    return _Result.ok(this._data);
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
  match(handlers) {
    if (this.isOk()) {
      return handlers.ok(this._data);
    }
    return handlers.err(this._error);
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
  tap(fn) {
    if (this.isOk()) {
      fn(this._data);
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
  inspect(fn) {
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
  tapErr(fn) {
    if (this.isErr()) {
      fn(this._error);
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
  inspectErr(fn) {
    return this.tapErr(fn);
  }
};

export { Result };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map