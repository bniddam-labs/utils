# bniddam-labs/utils ⚙️✨

[![Build Status](https://img.shields.io/badge/build-pending-lightgrey.svg)](https://github.com/bniddam-labs/utils) [![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) [![npm](https://img.shields.io/badge/npm-unpublished-lightgrey.svg)]()

A tiny, focused collection of utility functions used across bniddam-labs projects — lightweight, well-typed, and easy to import. 🚀

Table of contents

- ✨ Features
- 🚀 Getting started
- 📦 Install
- 🧩 Usage
- 📚 Real examples (from the code)
  - Configuration Management
  - Result Pattern
  - String Utilities
- 📌 Roadmap
- 📝 License
- 📬 Contact

✨ Features

- Small, well-documented helpers for string sanitization, validation, result handling, and configuration management.
- Designed for tree-shaking: import only the modules / functions you need.
- TypeScript-first with JSDoc and runtime-friendly exports.
- Modular configuration system with Zod validation and environment variable loading.

🚀 Getting started
Clone and install locally:

```bash
git clone https://github.com/bniddam-labs/utils.git
cd utils
npm install
```

Build (if applicable):

```bash
npm run build
```

📦 Install
Use the package straight from GitHub (no npm publish needed):

- npm

```bash
npm i github:bniddam-labs/utils
```

- yarn

```bash
yarn add github:bniddam-labs/utils
```

- pnpm

```bash
pnpm add github:bniddam-labs/utils
```

🧩 Usage
This package exposes several entry points — the top-level package re-exports selected modules and there are explicit submodules for focused imports:

- Top-level

```js
import * as utils from '@bniddam-labs/utils';
```

- Submodules (recommended for smaller bundles)

```js
import * as stringUtils from '@bniddam-labs/utils/string';
import * as resultUtils from '@bniddam-labs/utils/result';
import * as validation from '@bniddam-labs/utils/validation';
import * as pagination from '@bniddam-labs/utils/pagination';
import * as id from '@bniddam-labs/utils/id';
import * as config from '@bniddam-labs/utils/config';
```

📚 Examples (from the code)

## Result Pattern

Type-safe error handling inspired by Rust's `Result<T, E>`. Encode success/failure in types instead of throwing exceptions.

### Basic Usage

```ts
import { Result } from '@bniddam-labs/utils/result';

// Create results
const success = Result.ok(42);
const failure = Result.err(new Error('Something went wrong'));

// Check status
if (success.isOk()) {
  console.log(success.unwrap()); // 42
}

// Pattern matching
const value = success.match({
  ok: (data) => `Success: ${data}`,
  err: (error) => `Error: ${error.message}`
});
```

### Transforming Values

```ts
// Map successful values
const doubled = Result.ok(5)
  .map(x => x * 2)
  .map(x => `Result: ${x}`);
// Result.ok("Result: 10")

// Chain operations that return Results
const result = Result.ok(5)
  .flatMap(x => x > 0 ? Result.ok(x * 2) : Result.err('negative'))
  .flatMap(x => Result.ok(x + 1));
// Result.ok(11)

// Transform errors
const apiError = Result.err('Not found')
  .mapErr(msg => ({ code: 404, message: msg }));
```

### Working with Exceptions

```ts
// Wrap functions that throw
const parsed = Result.try(() => JSON.parse(input));

// With custom error mapping
const safe = Result.try(
  () => riskyOperation(),
  (e) => new CustomError(String(e))
);

// Async operations
const user = await Result.fromPromise(
  fetch('/api/user'),
  (e) => new ApiError(String(e))
);
```

### Collection Operations

```ts
// Combine multiple Results (fail-fast)
const results = [Result.ok(1), Result.ok(2), Result.ok(3)];
const combined = Result.all(results);
// Result.ok([1, 2, 3])

// Map array through Result-returning function
const parseNumber = (s: string) =>
  isNaN(+s) ? Result.err('invalid') : Result.ok(+s);

const parsed = Result.traverse(['1', '2', '3'], parseNumber);
// Result.ok([1, 2, 3])
```

### Railway-Oriented Programming

```ts
// Chain operations that can fail
const processUser = (id: number) =>
  fetchUser(id)
    .flatMap(validateUser)
    .flatMap(enrichUserData)
    .map(formatUserResponse)
    .tapErr(error => logger.error('Failed to process user', error));

// Provide fallbacks
const result = fetchConfig()
  .orElse(() => loadDefaultConfig())
  .unwrapOr(FALLBACK_CONFIG);
```

### Side Effects

```ts
// Execute side effects without changing the Result
Result.ok(user)
  .tap(u => logger.info('Processing user', u.id))
  .map(u => u.profile)
  .tapErr(err => logger.error('Failed', err));
```

## Configuration Management

Type-safe, modular configuration system with Zod validation and environment variable loading.

### Quick Start

```ts
import { createConfigBuilder } from '@bniddam-labs/utils/config';

// Selective loading - only load what you need
const config = createConfigBuilder()
  .fromDotEnv()
  .app()
  .database()
  .s3()
  .build();
```

### Custom Configuration Sections

```ts
import { z } from 'zod';
import {
  createConfigBuilder,
  createNestedEnvLoader,
  type AppConfig,
  type DatabaseConfig
} from '@bniddam-labs/utils/config';

// Define your custom schema
const CustomServiceSchema = z.object({
  url: z.string().url(),
  apiKey: z.string(),
  credentials: z.object({
    username: z.string(),
    password: z.string()
  })
});

// Create loader for environment variables
const loader = createNestedEnvLoader({
  url: 'http://localhost:3000',
  apiKey: '',
  credentials: { username: 'admin', password: 'secret' }
});

// Define complete config type
type MyConfig = {
  app: AppConfig;
  database: DatabaseConfig;
  customService: z.infer<typeof CustomServiceSchema>;
};

// Build with type safety
const config = createConfigBuilder()
  .fromDotEnv()
  .app()
  .database()
  .addCustom('customService', CustomServiceSchema, loader)
  .build<MyConfig>();

// TypeScript knows about your custom section
console.log(config.customService.url); // ✅ Full autocomplete
```

### Fully Custom Configuration

```ts
// Use completely custom config without any predefined sections
const MyConfigSchema = z.object({
  api: z.object({ url: z.string(), key: z.string() }),
  database: z.object({ host: z.string(), port: z.number() }),
  features: z.object({ beta: z.boolean() })
});

type MyConfig = {
  app: z.infer<typeof MyConfigSchema>;
};

const config = createConfigBuilder()
  .fromDotEnv()
  .addCustom('app', MyConfigSchema, createNestedEnvLoader({
    api: { url: 'http://localhost', key: '' },
    database: { host: 'localhost', port: 5432 },
    features: { beta: false }
  }))
  .build<MyConfig>();
```

**For complete documentation**, see [src/config/README.md](src/config/README.md).

## String Utilities

Below are real, working examples based on functions exported by the string module (these examples are from the repository source):

- sanitizeFilename

```js
import { sanitizeFilename } from '@bniddam-labs/utils/string';

// Prevent path traversal and remove unsafe characters
console.log(sanitizeFilename('../../etc/passwd')); // -> 'etc_passwd'
console.log(sanitizeFilename('my file (1).txt')); // -> 'my_file_1.txt'
console.log(sanitizeFilename('')); // -> throws error
```

- sanitizeSearchInput

```js
import { sanitizeSearchInput } from '@bniddam-labs/utils/string';

// Escape SQL LIKE wildcards (%, _) and backslash
console.log(sanitizeSearchInput('100%')); // -> '100\\%'
console.log(sanitizeSearchInput('user_test')); // -> 'user\\_test'
```

- truncate

```js
import { truncate } from '@bniddam-labs/utils/string';

console.log(truncate('This is a very long string', 10)); // -> 'This is...'
console.log(truncate('Short text', 20)); // -> 'Short text'
```

- removeWhitespace / normalizeWhitespace

```js
import { removeWhitespace, normalizeWhitespace } from '@bniddam-labs/utils/string';

console.log(removeWhitespace('  hello  world  ')); // -> 'helloworld'
console.log(normalizeWhitespace('  hello    world  ')); // -> 'hello world'
```

Discover exports at runtime

```js
import * as stringUtils from '@bniddam-labs/utils/string';
console.log(Object.keys(stringUtils)); // lists the actual exported helper names
```

Notes about modules

- The top-level package re-exports a subset of modules. For the most explicit imports and smaller bundles, prefer importing from the submodules (for example '@bniddam-labs/utils/string').
- Authoritative entrypoints (from package.json): @bniddam-labs/utils, @bniddam-labs/utils/string, @bniddam-labs/utils/result, @bniddam-labs/utils/validation, @bniddam-labs/utils/pagination, @bniddam-labs/utils/id, @bniddam-labs/utils/config.

📌 Roadmap
Planned improvements:

- Publish typed package to npm
- Add more utilities and richer validation helpers
- Optimize bundle size and add CI + badges
- Add automated releases

📝 License
MIT — see LICENSE.

📬 Contact
Maintainers: bniddam-labs  
For help or requests, open an issue or start a discussion on the repository. Thank you! ❤️
