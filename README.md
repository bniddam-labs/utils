# bniddam-labs/utils ⚙️✨

[![Build Status](https://img.shields.io/badge/build-pending-lightgrey.svg)](https://github.com/bniddam-labs/utils) [![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) [![npm](https://img.shields.io/badge/npm-unpublished-lightgrey.svg)]()

A tiny, focused collection of utility functions used across bniddam-labs projects — lightweight, well-typed, and easy to import. 🚀

Table of contents

- ✨ Features
- 🚀 Getting started
- 📦 Install
- 🧩 Usage
- 📚 Real examples (from the code)
- 📌 Roadmap
- 📝 License
- 📬 Contact

✨ Features

- Small, well-documented helpers for string sanitization, validation, and result handling.
- Designed for tree-shaking: import only the modules / functions you need.
- TypeScript-first with JSDoc and runtime-friendly exports.

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

Or if/when published to npm:

```bash
npm i @bniddam-labs/utils
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
```

📚 Examples (from the code)
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
- Authoritative entrypoints (from package.json): @bniddam-labs/utils, @bniddam-labs/utils/string, @bniddam-labs/utils/result, @bniddam-labs/utils/validation, @bniddam-labs/utils/pagination, @bniddam-labs/utils/id.

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
