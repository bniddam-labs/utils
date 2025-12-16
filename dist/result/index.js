'use strict';

var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

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
  unwrapErr() {
    if (!this._success) {
      return this._error;
    }
    throw new Error("unwrapErr() called on an Ok result");
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
  unwrapOrElse(fn) {
    return this._success ? this._data : fn(this._error);
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
    if (this._success) {
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
    if (!this._success) {
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
    if (this._success) {
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
    if (!this._success) {
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
    return this._success ? handlers.ok(this._data) : handlers.err(this._error);
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
    if (this._success) {
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
    if (!this._success) {
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
  // ---- Helper methods ----
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
  static try(fn, mapError = (e) => e) {
    try {
      return _Result.ok(fn());
    } catch (e) {
      return _Result.err(mapError(e));
    }
  }
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
  static fromPromise(p, mapError = (e) => e) {
    return __async(this, null, function* () {
      try {
        return _Result.ok(yield p);
      } catch (e) {
        return _Result.err(mapError(e));
      }
    });
  }
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
  static all(results) {
    const out = [];
    for (const r of results) {
      if (r.isErr()) {
        return _Result.err(r.unwrapErr());
      }
      out.push(r.unwrap());
    }
    return _Result.ok(out);
  }
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
  static traverse(values, fn) {
    const out = [];
    for (const v of values) {
      const r = fn(v);
      if (r.isErr()) {
        return _Result.err(r.unwrapErr());
      }
      out.push(r.unwrap());
    }
    return _Result.ok(out);
  }
};

exports.Result = Result;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map