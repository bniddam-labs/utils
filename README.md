# @bniddam/utils

Framework-agnostic utility functions with Zod validation for TypeScript projects.

## Features

- **Pagination**: Type-safe pagination helpers and schemas
- **ID Generation**: Slug generation and ID validation
- **String Utilities**: Sanitization, masking, and validation
- **Result Pattern**: Type-safe error handling with Result<T, E>
- **Validation**: Zod schema helpers and validation utilities
- **Zero Dependencies**: Only requires Zod
- **Tree-shakeable**: Import only what you need
- **Fully Typed**: Complete TypeScript support

## Installation

### Using pnpm link (local development)

```bash
# In @bniddam/utils directory
pnpm install
pnpm build
pnpm link --global

# In your project
pnpm link --global @bniddam/utils
```

### Using npm/pnpm (when published)

```bash
pnpm add @bniddam/utils
# or
npm install @bniddam/utils
```

## Usage

### Pagination

```typescript
import { PaginationSchema, calculatePagination } from '@bniddam/utils/pagination';

// Validate pagination params
const params = PaginationSchema.parse({ page: 1, limit: 10 });

// Calculate pagination metadata
const pagination = calculatePagination({ page: 1, limit: 10, total: 100 });
// { page: 1, limit: 10, total: 100, totalPages: 10, hasNext: true, hasPrev: false }
```

### ID & Slug Helpers

```typescript
import { generateSlug, IdSchema } from '@bniddam/utils/id';

// Generate URL-safe slugs
const slug = generateSlug('Hello World!'); // "hello-world"

// Validate UUIDs
IdSchema.parse('123e4567-e89b-12d3-a456-426614174000');
```

### String Utilities

```typescript
import { sanitizeHtml, maskEmail } from '@bniddam/utils/string';

// Sanitize HTML input
const safe = sanitizeHtml('<script>alert("xss")</script>Hello');
// "Hello"

// Mask sensitive data
const masked = maskEmail('user@example.com'); // "u***@example.com"
```

### Result Pattern

```typescript
import { Result, Ok, Err } from '@bniddam/utils/result';

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return Err('Division by zero');
  }
  return Ok(a / b);
}

const result = divide(10, 2);
if (result.ok) {
  console.log(result.value); // 5
} else {
  console.error(result.error);
}
```

### Validation Helpers

```typescript
import { createValidator } from '@bniddam/utils/validation';
import { z } from 'zod';

const UserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

const validate = createValidator(UserSchema);
const result = validate({ name: 'John', email: 'john@example.com' });
```

## API Reference

### Pagination

- `PaginationSchema` - Zod schema for pagination params
- `calculatePagination(params)` - Calculate pagination metadata
- `PaginationParams` - Type for pagination parameters
- `PaginationMeta` - Type for pagination metadata

### ID

- `generateSlug(text)` - Generate URL-safe slug
- `IdSchema` - Zod schema for UUID validation
- `SlugSchema` - Zod schema for slug validation

### String

- `sanitizeHtml(html)` - Remove potentially dangerous HTML
- `maskEmail(email)` - Mask email address
- `maskPhone(phone)` - Mask phone number
- `EmailSchema` - Zod schema for email validation

### Result

- `Result<T, E>` - Type for result pattern
- `Ok(value)` - Create successful result
- `Err(error)` - Create error result

### Validation

- `createValidator(schema)` - Create validation function from Zod schema
- `parseOrThrow(schema, data)` - Parse data or throw formatted error

## Development

```bash
# Install dependencies
pnpm install

# Build the package
pnpm build

# Watch mode
pnpm dev

# Run tests
pnpm test

# Type check
pnpm typecheck

# Lint
pnpm lint

# Format
pnpm format
```

## Requirements

- Node.js >= 20
- pnpm >= 9

## License

MIT © bniddam
