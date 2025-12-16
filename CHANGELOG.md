# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.1] - 2025-12-16

### Fixed - Result Type Safety

Critical type safety improvements to the `Result<T, E>` class:

#### Breaking Changes

**Type Guards**
- `isOk()` now returns `boolean` instead of `this is Result<T, never>`
- `isErr()` now returns `boolean` instead of `this is Result<never, E>`

**Reason:** The previous type predicates were unsound. TypeScript cannot safely narrow generic type parameters of class instances. The new boolean returns maintain correctness while still providing runtime checks.

**Migration:**
```ts
// Before (unsafe narrowing)
if (result.isOk()) {
  // TypeScript incorrectly thought result was Result<T, never>
  const value = result.unwrap();
}

// After (safe runtime checks)
if (result.isOk()) {
  // TypeScript correctly knows result is still Result<T, E>
  // Runtime guarantees safety
  const value = result.unwrap();
}
```

#### Fixed Type Drift in Combinators

All combinator methods now explicitly specify type parameters to prevent error type drift:

- **map**: Preserves error type `E` correctly
- **mapErr**: Preserves value type `T` correctly
- **flatMap**: Preserves error type `E` correctly
- **orElse**: Correctly transforms error types
- **match**: Direct ternary for consistency

**Before (type drift bug):**
```ts
const result: Result<number, CustomError> = Result.ok(5);
const mapped = result.map(x => x * 2);
// Bug: mapped had type Result<number, Error> instead of Result<number, CustomError>
```

**After (type safe):**
```ts
const result: Result<number, CustomError> = Result.ok(5);
const mapped = result.map(x => x * 2);
// Correct: mapped has type Result<number, CustomError>
```

### Added

**New Unwrap Methods**
- `unwrapErr(): E` - Extract error value or throw if Ok
- `unwrapOrElse(fn: (E) => T): T` - Compute fallback from error

**New Helper Methods**

1. **`Result.try<T, E>(fn, mapError?)`** - Wrap throw-based code in Result
   ```ts
   const parsed = Result.try(() => JSON.parse(input));
   const custom = Result.try(
     () => riskyOp(),
     (e) => new CustomError(String(e))
   );
   ```

2. **`Result.fromPromise<T, E>(promise, mapError?)`** - Convert Promise to Result
   ```ts
   const result = await Result.fromPromise(fetch('/api/data'));
   const typed = await Result.fromPromise(
     apiCall(),
     (e) => new ApiError(String(e))
   );
   ```

3. **`Result.all<T, E>(results)`** - Combine array of Results (fail-fast)
   ```ts
   const combined = Result.all([
     Result.ok(1),
     Result.ok(2),
     Result.ok(3)
   ]); // Result.ok([1, 2, 3])
   ```

4. **`Result.traverse<A, T, E>(values, fn)`** - Map array through Result-returning function
   ```ts
   const parseNum = (s: string) =>
     isNaN(+s) ? Result.err('invalid') : Result.ok(+s);

   const parsed = Result.traverse(['1', '2', '3'], parseNum);
   // Result.ok([1, 2, 3])
   ```

### Documentation

- Added comprehensive Result API reference (`src/result/README.md`)
- Added Result examples to main README
- Added this CHANGELOG with migration guide
- All 59 tests passing with full type safety

### Internal

- Replaced type guard usage (`this.isOk()`) with direct `this._success` checks in combinators
- Consistent use of type assertions (`as T`, `as E`) only after runtime checks
- All combinators use explicit type parameters: `Result.ok<U, E>()`, `Result.err<T, F>()`

## [2.0.0] - 2025-11-26

### Added
- Initial Result pattern implementation
- String sanitization utilities
- Validation helpers
- Pagination utilities
- ID generation utilities

## Migration Guide: 1.x → 2.0.1

### Breaking Changes

#### 1. Type Guards Return Boolean

**What changed:**
```ts
// v1.x (incorrect)
isOk(): this is Result<T, never>
isErr(): this is Result<never, E>

// v2.0.1 (correct)
isOk(): boolean
isErr(): boolean
```

**Impact:** LOW - Runtime behavior unchanged, only TypeScript type narrowing affected

**Action Required:** None in most cases. If you relied on the type narrowing:

```ts
// Before (relied on broken narrowing)
if (result.isOk()) {
  // TypeScript thought error type was 'never'
  return result; // thought to be Result<T, never>
}

// After (use explicit types)
if (result.isOk()) {
  return result as Result<T, never>; // explicit if really needed
  // Or better: just use unwrap/match
  return result.unwrap();
}
```

**Recommendation:** Use `match()`, `unwrap()`, or `unwrapOr()` instead of relying on type guards for control flow.

#### 2. Error Type Preservation

**What changed:** Error types are now correctly preserved through transformations.

**Impact:** POSITIVE - Your code is now more type-safe

**Action Required:** None, unless you have incorrect type annotations that were previously hidden:

```ts
// This now correctly shows a type error:
const result: Result<string, never> = Result.ok(5)
  .map(x => String(x))
  .mapErr(e => e); // Error type is still inferred from context

// Fix by using correct types:
const result: Result<string, Error> = Result.ok<number, Error>(5)
  .map(x => String(x));
```

### New Features You Can Adopt

#### 1. Use `Result.try` for Exception Handling

```ts
// Old way
let result: Result<Data, Error>;
try {
  result = Result.ok(JSON.parse(input));
} catch (e) {
  result = Result.err(e instanceof Error ? e : new Error(String(e)));
}

// New way
const result = Result.try(
  () => JSON.parse(input),
  (e) => e instanceof Error ? e : new Error(String(e))
);
```

#### 2. Use `Result.fromPromise` for Async Operations

```ts
// Old way
let result: Result<User, Error>;
try {
  const user = await fetchUser(id);
  result = Result.ok(user);
} catch (e) {
  result = Result.err(new Error(String(e)));
}

// New way
const result = await Result.fromPromise(
  fetchUser(id),
  (e) => new Error(String(e))
);
```

#### 3. Use `Result.all` for Combining Results

```ts
// Old way
const results = [validateName(name), validateAge(age), validateEmail(email)];
let combined: Result<[string, number, string], ValidationError>;
for (const r of results) {
  if (r.isErr()) {
    combined = Result.err(r.unwrapErr());
    break;
  }
}
if (!combined) {
  combined = Result.ok([/* ... */]);
}

// New way
const combined = Result.all([
  validateName(name),
  validateAge(age),
  validateEmail(email)
]);
```

#### 4. Use `Result.traverse` for Array Transformations

```ts
// Old way
function parseNumbers(strings: string[]): Result<number[], string> {
  const numbers: number[] = [];
  for (const s of strings) {
    const n = Number(s);
    if (isNaN(n)) {
      return Result.err(`Invalid: ${s}`);
    }
    numbers.push(n);
  }
  return Result.ok(numbers);
}

// New way
const parseNumber = (s: string) =>
  isNaN(+s) ? Result.err(`Invalid: ${s}`) : Result.ok(+s);

const parseNumbers = (strings: string[]) =>
  Result.traverse(strings, parseNumber);
```

### Verification

After upgrading, run:

```bash
# Type check
pnpm typecheck

# Run tests
pnpm test

# Build
pnpm build
```

All existing code should continue to work with improved type safety.

### Need Help?

If you encounter issues during migration:

1. Check the [Result API Reference](./src/result/README.md)
2. Review the [test suite](./src/result/result.test.ts) for examples
3. Open an issue on GitHub

## Technical Notes

### Why the Type Guard Change?

TypeScript's control flow analysis works well with discriminated unions:

```ts
// This works (discriminated union)
type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

if (result.ok) {
  // TypeScript correctly narrows to { ok: true; value: T }
}
```

But NOT with class generic parameters:

```ts
// This doesn't work reliably (class generics)
class Result<T, E> {
  isOk(): this is Result<T, never> // ❌ Unsound
}
```

The issue is that `this is Result<T, never>` attempts to rewrite the generic parameters of an already-instantiated class, which TypeScript cannot verify at compile time.

### Why Explicit Type Parameters?

Generic defaults in factory methods can cause type drift:

```ts
// Without explicit type parameters
class Result<T, E = Error> {
  static ok<T, E = Error>(data: T): Result<T, E> { /*...*/ }
  static err<T = never, E = Error>(error: E): Result<T, E> { /*...*/ }

  map<U>(fn: (data: T) => U): Result<U, E> {
    return Result.ok(fn(this._data)); // ❌ E becomes Error!
  }
}

// With explicit type parameters
map<U>(fn: (data: T) => U): Result<U, E> {
  return Result.ok<U, E>(fn(this._data)); // ✅ E preserved
}
```

This ensures error types flow correctly through transformation chains.
