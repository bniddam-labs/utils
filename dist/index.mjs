import { z } from 'zod';

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

// src/string/sanitization.helpers.ts
function sanitizeFilename(filename, maxLength = 255) {
  let sanitized = filename.replace(/\0/g, "");
  sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, "_");
  sanitized = sanitized.replace(/^[._]+|[._]+$/g, "");
  sanitized = sanitized.replace(/\.+/g, ".");
  const dotIndex = sanitized.lastIndexOf(".");
  const ext = dotIndex > 0 ? sanitized.slice(dotIndex) : "";
  const nameWithoutExt = dotIndex > 0 ? sanitized.slice(0, dotIndex) : sanitized;
  if (sanitized.length > maxLength) {
    const maxNameLength = maxLength - ext.length;
    sanitized = nameWithoutExt.slice(0, maxNameLength) + ext;
  }
  if (!sanitized || sanitized === ext || sanitized.length === 0) {
    sanitized = `file${ext || ".bin"}`;
  }
  return sanitized;
}
function sanitizeSearchInput(search) {
  return search.replace(/[%_\\]/g, "\\$&");
}
function truncate(str, maxLength = 100, ellipsis = "...") {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength - ellipsis.length) + ellipsis;
}
function removeWhitespace(str) {
  return str.replace(/\s+/g, "");
}
function normalizeWhitespace(str) {
  return str.replace(/\s+/g, " ").trim();
}

// src/string/masking.helpers.ts
function maskEmail(email, visibleChars = 2) {
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) {
    return email;
  }
  const visiblePart = localPart.slice(0, Math.min(visibleChars, localPart.length));
  return `${visiblePart}***@${domain}`;
}
function maskPhone(phone, visibleDigits = 4) {
  if (phone.length <= visibleDigits) {
    return "*".repeat(phone.length);
  }
  const masked = phone.slice(0, -visibleDigits).replace(/[0-9]/g, "*");
  const visible = phone.slice(-visibleDigits);
  return masked + visible;
}
function maskCardNumber(cardNumber, visibleDigits = 4, separator = " ") {
  const digitsOnly = cardNumber.replace(/\D/g, "");
  if (digitsOnly.length <= visibleDigits) {
    return "*".repeat(digitsOnly.length);
  }
  const visible = digitsOnly.slice(-visibleDigits);
  const maskedCount = digitsOnly.length - visibleDigits;
  const maskedGroups = Math.ceil(maskedCount / 4);
  const masked = Array(maskedGroups).fill("****").join(separator);
  return `${masked}${separator}${visible}`;
}
function maskString(str, visibleStart = 2, visibleEnd = 2, maskChar = "*") {
  if (str.length <= visibleStart + visibleEnd) {
    return str;
  }
  const start = str.slice(0, visibleStart);
  const end = str.slice(-visibleEnd);
  const maskedLength = str.length - visibleStart - visibleEnd;
  return `${start}${maskChar.repeat(maskedLength)}${end}`;
}
var emailSchema = z.string().email("Invalid email address");
var phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format (E.164 format expected)");
var urlSchema = z.string().url("Invalid URL format");
var filenameSchema = z.string().min(1, "Filename cannot be empty").max(255, "Filename too long").regex(/^[a-zA-Z0-9._-]+$/, "Filename contains invalid characters");
var slugStringSchema = z.string().min(1).max(100).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Invalid slug format");
var nonEmptyStringSchema = z.string().trim().min(1, "String cannot be empty");
var alphanumericSchema = z.string().regex(/^[a-zA-Z0-9]+$/, "Must contain only letters and numbers");
var hexColorSchema = z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color format");
var createStringSchema = (min, max, message) => z.string().min(min, message).max(max, message);
var createEnumSchema = (values) => z.enum(values);

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

// src/validation/validation.helpers.ts
function safeParse(schema, data) {
  const result = schema.safeParse(data);
  if (result.success) {
    return {
      success: true,
      data: result.data,
      errors: null
    };
  }
  return {
    success: false,
    data: null,
    errors: formatZodErrors(result.error)
  };
}
function parse(schema, data) {
  return schema.parse(data);
}
function validateAll(validations) {
  const errors = [];
  const data = {};
  for (const [key, [schema, value]] of Object.entries(validations)) {
    const result = safeParse(schema, value);
    if (result.success) {
      data[key] = result.data;
    } else {
      errors.push(
        ...result.errors.map((err) => __spreadProps(__spreadValues({}, err), {
          path: `${key}.${err.path}`
        }))
      );
    }
  }
  if (errors.length > 0) {
    return {
      success: false,
      data: null,
      errors
    };
  }
  return {
    success: true,
    data,
    errors: null
  };
}
function isValid(schema, data) {
  return schema.safeParse(data).success;
}
function formatZodErrors(error) {
  return error.issues.map((err) => ({
    path: err.path.join(".") || "root",
    message: err.message,
    code: err.code
  }));
}
function createValidator(schema) {
  return (data) => safeParse(schema, data);
}
function createTypeGuard(schema) {
  return (data) => isValid(schema, data);
}

export { Result, alphanumericSchema, createEnumSchema, createStringSchema, createTypeGuard, createValidator, emailSchema, filenameSchema, formatZodErrors, hexColorSchema, isValid, maskCardNumber, maskEmail, maskPhone, maskString, nonEmptyStringSchema, normalizeWhitespace, parse, phoneSchema, removeWhitespace, safeParse, sanitizeFilename, sanitizeSearchInput, slugStringSchema, truncate, urlSchema, validateAll };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map