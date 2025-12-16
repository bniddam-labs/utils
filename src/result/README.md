# Result<T, E>

Type-safe error handling for TypeScript, inspired by Rust's `Result<T, E>` and functional programming patterns.

## Why Result?

The **Result pattern** encodes success and failure explicitly in the type system, providing:

- **Type-safe error handling** without exceptions
- **Explicit error types** that TypeScript can verify
- **Composable operations** via map, flatMap, and other combinators
- **Railway-oriented programming** for clean error propagation

This is the functional programming alternative to throwing exceptions, popularized by languages like Rust, Haskell (Either), and Scala.

## Installation

```bash
npm install @bniddam-labs/utils
# or
pnpm add @bniddam-labs/utils
# or
yarn add @bniddam-labs/utils
```

## Quick Start

```ts
import { Result } from '@bniddam-labs/utils/result';

// Create results
const success = Result.ok(42);
const failure = Result.err(new Error('failed'));

// Transform values
const doubled = success.map(x => x * 2); // Result.ok(84)

// Pattern matching
const message = success.match({
  ok: (value) => `Got: ${value}`,
  err: (error) => `Error: ${error.message}`
});
```

## API Reference

### Factory Methods

#### `Result.ok<T, E>(value: T): Result<T, E>`

Create a successful result containing a value.

```ts
const result = Result.ok(42);
result.isOk(); // true
result.unwrap(); // 42
```

#### `Result.err<T, E>(error: E): Result<T, E>`

Create a failed result containing an error.

```ts
const result = Result.err(new Error('Not found'));
result.isErr(); // true
result.unwrapErr(); // Error('Not found')
```

### Type Guards

#### `isOk(): boolean`

Returns `true` if the result is Ok.

```ts
if (result.isOk()) {
  console.log('Success!');
}
```

#### `isErr(): boolean`

Returns `true` if the result is Err.

```ts
if (result.isErr()) {
  console.error('Failed!');
}
```

### Unwrapping

#### `unwrap(): T`

Extract the value from an Ok result. **Throws if Err.**

```ts
const value = Result.ok(42).unwrap(); // 42
Result.err('failed').unwrap(); // throws 'failed'
```

#### `unwrapErr(): E`

Extract the error from an Err result. **Throws if Ok.**

```ts
const error = Result.err('failed').unwrapErr(); // 'failed'
Result.ok(42).unwrapErr(); // throws Error
```

#### `unwrapOr(defaultValue: T): T`

Return the value if Ok, otherwise return the default.

```ts
Result.ok(42).unwrapOr(0); // 42
Result.err('failed').unwrapOr(0); // 0
```

#### `unwrapOrElse(fn: (error: E) => T): T`

Return the value if Ok, otherwise compute a value from the error.

```ts
Result.ok(42).unwrapOrElse(() => 0); // 42
Result.err('failed').unwrapOrElse(err => err.length); // 6
```

### Transformations

#### `map<U>(fn: (value: T) => U): Result<U, E>`

Transform the Ok value, leave Err unchanged.

```ts
Result.ok(5).map(x => x * 2); // Result.ok(10)
Result.err('failed').map(x => x * 2); // Result.err('failed')
```

#### `mapErr<F>(fn: (error: E) => F): Result<T, F>`

Transform the Err value, leave Ok unchanged.

```ts
Result.ok(5).mapErr(e => new Error(e)); // Result.ok(5)
Result.err('failed').mapErr(e => new Error(e)); // Result.err(Error('failed'))
```

#### `flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E>`

Chain operations that return Results. Also known as `andThen`.

```ts
Result.ok(5)
  .flatMap(x => Result.ok(x * 2))
  .flatMap(x => Result.ok(x + 1)); // Result.ok(11)

Result.ok(5)
  .flatMap(x => Result.err('too small')); // Result.err('too small')
```

#### `andThen<U>(fn: (value: T) => Result<U, E>): Result<U, E>`

Alias for `flatMap`. Use whichever name is more readable in context.

```ts
Result.ok(user)
  .andThen(validateAge)
  .andThen(enrichProfile); // Chain validations
```

#### `orElse<F>(fn: (error: E) => Result<T, F>): Result<T, F>`

Provide an alternative Result if current is Err.

```ts
Result.err('failed')
  .orElse(() => Result.ok('default')); // Result.ok('default')

Result.ok(42)
  .orElse(() => Result.ok(0)); // Result.ok(42) - not called
```

### Pattern Matching

#### `match<U>(handlers: { ok: (T) => U, err: (E) => U }): U`

Handle both cases explicitly and extract a value.

```ts
const message = result.match({
  ok: (value) => `Success: ${value}`,
  err: (error) => `Error: ${error.message}`
});
```

### Side Effects

#### `tap(fn: (value: T) => void): Result<T, E>`

Execute a side effect on Ok without changing the Result. Also known as `inspect`.

```ts
Result.ok(user)
  .tap(u => logger.info('Processing user', u.id))
  .map(u => u.profile);
```

#### `tapErr(fn: (error: E) => void): Result<T, E>`

Execute a side effect on Err without changing the Result. Also known as `inspectErr`.

```ts
Result.err('failed')
  .tapErr(err => logger.error('Operation failed', err))
  .orElse(() => Result.ok('default'));
```

### Helper Methods

#### `Result.try<T, E>(fn: () => T, mapError?: (e: unknown) => E): Result<T, E>`

Wrap a function that may throw into a Result.

```ts
// Default: catches unknown errors
const parsed = Result.try(() => JSON.parse(input));

// Custom error mapping
const safe = Result.try(
  () => riskyOperation(),
  (e) => new CustomError(String(e))
);
```

#### `Result.fromPromise<T, E>(promise: Promise<T>, mapError?: (e: unknown) => E): Promise<Result<T, E>>`

Convert a Promise into a Result (handles rejection).

```ts
const result = await Result.fromPromise(fetch('/api/data'));

// Custom error mapping
const user = await Result.fromPromise(
  fetchUser(id),
  (e) => new ApiError(String(e))
);
```

#### `Result.all<T, E>(results: Result<T, E>[]): Result<T[], E>`

Combine an array of Results into a single Result (fail-fast).

Returns Ok with array of values if all are Ok, otherwise returns the first Err.

```ts
const results = [Result.ok(1), Result.ok(2), Result.ok(3)];
Result.all(results); // Result.ok([1, 2, 3])

const withError = [Result.ok(1), Result.err('failed'), Result.ok(3)];
Result.all(withError); // Result.err('failed')
```

#### `Result.traverse<A, T, E>(values: A[], fn: (a: A) => Result<T, E>): Result<T[], E>`

Map an array through a Result-returning function (fail-fast).

Similar to `Array.map`, but for functions that return Results.

```ts
const parseNumber = (s: string) =>
  isNaN(+s) ? Result.err('invalid') : Result.ok(+s);

Result.traverse(['1', '2', '3'], parseNumber);
// Result.ok([1, 2, 3])

Result.traverse(['1', 'x', '3'], parseNumber);
// Result.err('invalid')
```

## Design Principles

### Type Safety

All combinators preserve type information through explicit generic parameters:

```ts
// Error type is preserved through transformations
type ApiError = { code: number; message: string };
const result: Result<User, ApiError> = fetchUser(id)
  .map(user => user.profile) // Result<Profile, ApiError>
  .mapErr(e => ({ ...e, context: 'profile' })); // Still ApiError
```

### Fail-Fast Semantics

Both `Result.all` and `Result.traverse` use fail-fast semantics: they stop at the first error and return it immediately. This matches Rust's behavior and is suitable for most validation pipelines.

### Explicit vs Implicit

Unlike traditional exception handling, Result forces you to handle errors explicitly:

```ts
// ❌ Exception-based (errors are implicit)
try {
  const user = JSON.parse(input);
  const validated = validateUser(user);
  return formatUser(validated);
} catch (e) {
  // What type is e? What can fail?
  return defaultUser;
}

// ✅ Result-based (errors are explicit)
const user: Result<User, ValidationError> =
  Result.try(() => JSON.parse(input))
    .mapErr(e => ({ field: 'input', message: String(e) }))
    .flatMap(validateUser)
    .map(formatUser)
    .unwrapOr(defaultUser);
```

## Common Patterns

### Validation Pipeline

```ts
type ValidationError = { field: string; message: string };

const validateAge = (age: number): Result<number, ValidationError> =>
  age >= 18 && age <= 120
    ? Result.ok(age)
    : Result.err({ field: 'age', message: 'Invalid age' });

const validateEmail = (email: string): Result<string, ValidationError> =>
  email.includes('@')
    ? Result.ok(email)
    : Result.err({ field: 'email', message: 'Invalid email' });

const createUser = (data: unknown) =>
  Result.ok(data)
    .flatMap(extractAge)
    .flatMap(validateAge)
    .flatMap(extractEmail)
    .flatMap(validateEmail)
    .map(createUserObject);
```

### Database Operations

```ts
const getUserProfile = (userId: string) =>
  Result.fromPromise(db.users.findById(userId))
    .then(result => result
      .flatMap(user => user
        ? Result.ok(user)
        : Result.err(new NotFoundError('User not found'))
      )
      .flatMap(user =>
        Result.fromPromise(db.profiles.findByUserId(user.id))
      )
      .map(profile => ({ user, profile }))
    );
```

### API Error Handling

```ts
type ApiError =
  | { type: 'network'; message: string }
  | { type: 'validation'; errors: Record<string, string> }
  | { type: 'unauthorized'; message: string };

const callApi = async (endpoint: string): Promise<Result<Data, ApiError>> => {
  const result = await Result.fromPromise(
    fetch(endpoint),
    (e) => ({ type: 'network' as const, message: String(e) })
  );

  return result
    .flatMap(async response => {
      if (response.status === 401) {
        return Result.err({ type: 'unauthorized', message: 'Not authorized' });
      }
      if (response.status >= 400) {
        const errors = await response.json();
        return Result.err({ type: 'validation', errors });
      }
      return Result.ok(await response.json());
    });
};
```

### Combining Multiple Operations

```ts
// Parallel operations that all must succeed
const loadUserDashboard = async (userId: string) => {
  const [user, posts, notifications] = await Promise.all([
    Result.fromPromise(fetchUser(userId)),
    Result.fromPromise(fetchPosts(userId)),
    Result.fromPromise(fetchNotifications(userId)),
  ]);

  return Result.all([user, posts, notifications])
    .map(([u, p, n]) => ({ user: u, posts: p, notifications: n }));
};
```

## Comparison with Other Approaches

### vs Exceptions

| Aspect | Exceptions | Result |
|--------|-----------|--------|
| Error visibility | Hidden in code flow | Explicit in types |
| Type safety | No type for errors | Full type safety |
| Composability | try/catch blocks | Fluent combinators |
| Error propagation | Implicit | Explicit |
| Performance | Stack unwinding | No overhead |

### vs Nullable Types

| Aspect | null/undefined | Result |
|--------|----------------|--------|
| Error information | None | Full error value |
| Multiple errors | Can't distinguish | Different error types |
| Chaining | Requires null checks | Fluent API |
| Type safety | Partial (with ?) | Complete |

## Migration Guide

### From Exceptions

```ts
// Before
function parseConfig(input: string): Config {
  try {
    const data = JSON.parse(input);
    if (!isValidConfig(data)) {
      throw new Error('Invalid config');
    }
    return data;
  } catch (e) {
    throw new Error(`Failed to parse config: ${e}`);
  }
}

// After
function parseConfig(input: string): Result<Config, string> {
  return Result.try(() => JSON.parse(input))
    .mapErr(e => `JSON parse error: ${e}`)
    .flatMap(data =>
      isValidConfig(data)
        ? Result.ok(data)
        : Result.err('Invalid config format')
    );
}
```

### From Promises

```ts
// Before
async function getUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error('User not found');
  }
  return response.json();
}

// After
async function getUser(id: string): Promise<Result<User, ApiError>> {
  return Result.fromPromise(
    fetch(`/api/users/${id}`),
    (e) => ({ type: 'network', message: String(e) })
  ).then(result =>
    result.flatMap(async response =>
      response.ok
        ? Result.ok(await response.json())
        : Result.err({ type: 'not-found', message: 'User not found' })
    )
  );
}
```

## Further Reading

- [Railway Oriented Programming](https://fsharpforfunandprofit.com/rop/) - The pattern this implements
- [Rust Result Documentation](https://doc.rust-lang.org/std/result/) - Original inspiration
- [fp-ts Either](https://gcanti.github.io/fp-ts/modules/Either.ts.html) - Similar concept in TypeScript

## License

MIT
