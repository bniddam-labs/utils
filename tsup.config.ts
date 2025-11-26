import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'pagination/index': 'src/pagination/index.ts',
    'id/index': 'src/id/index.ts',
    'string/index': 'src/string/index.ts',
    'result/index': 'src/result/index.ts',
    'validation/index': 'src/validation/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
});
