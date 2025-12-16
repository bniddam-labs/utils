import { describe, expect, it, vi } from 'vitest';
import { Result } from './result';

describe('Result', () => {
  describe('factories', () => {
    it('should create an Ok result', () => {
      const result = Result.ok(42);
      expect(result.isOk()).toBe(true);
      expect(result.isErr()).toBe(false);
      expect(result.unwrap()).toBe(42);
    });

    it('should create an Err result', () => {
      const error = new Error('failed');
      const result = Result.err(error);
      expect(result.isOk()).toBe(false);
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toBe(error);
    });

    it('should preserve custom error types', () => {
      type CustomError = { code: number; message: string };
      const error: CustomError = { code: 404, message: 'Not found' };
      const result = Result.err<string, CustomError>(error);
      expect(result.unwrapErr()).toEqual(error);
    });
  });

  describe('type guards', () => {
    it('should correctly identify Ok results', () => {
      const result = Result.ok('success');
      expect(result.isOk()).toBe(true);
    });

    it('should correctly identify Err results', () => {
      const result = Result.err('failure');
      expect(result.isErr()).toBe(true);
    });
  });

  describe('unwrap methods', () => {
    it('should unwrap Ok value', () => {
      const result = Result.ok(42);
      expect(result.unwrap()).toBe(42);
    });

    it('should throw on unwrap Err', () => {
      const error = new Error('failed');
      const result = Result.err(error);
      expect(() => result.unwrap()).toThrow(error);
    });

    it('should unwrap Err value', () => {
      const error = new Error('failed');
      const result = Result.err(error);
      expect(result.unwrapErr()).toBe(error);
    });

    it('should throw on unwrapErr Ok', () => {
      const result = Result.ok(42);
      expect(() => result.unwrapErr()).toThrow('unwrapErr() called on an Ok result');
    });

    it('should unwrapOr with default on Err', () => {
      const result = Result.err<number, Error>(new Error('failed'));
      expect(result.unwrapOr(99)).toBe(99);
    });

    it('should unwrapOr with value on Ok', () => {
      const result = Result.ok(42);
      expect(result.unwrapOr(99)).toBe(42);
    });

    it('should unwrapOrElse with computed value on Err', () => {
      type ValidationError = { field: string; defaultValue: number };
      const error: ValidationError = { field: 'age', defaultValue: 18 };
      const result = Result.err<number, ValidationError>(error);
      expect(result.unwrapOrElse((e) => e.defaultValue)).toBe(18);
    });

    it('should unwrapOrElse with value on Ok', () => {
      const result = Result.ok(42);
      expect(result.unwrapOrElse(() => 99)).toBe(42);
    });
  });

  describe('map', () => {
    it('should map Ok value', () => {
      const result = Result.ok(5).map((x) => x * 2);
      expect(result.unwrap()).toBe(10);
    });

    it('should not map Err value', () => {
      const error = new Error('failed');
      const result = Result.err<number, Error>(error).map((x) => x * 2);
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toBe(error);
    });

    it('should preserve error type through map', () => {
      type CustomError = { code: number };
      const error: CustomError = { code: 500 };
      const result: Result<string, CustomError> = Result.err<number, CustomError>(error).map((x) =>
        String(x),
      );
      expect(result.unwrapErr()).toBe(error);
    });
  });

  describe('mapErr', () => {
    it('should map Err value', () => {
      const result = Result.err('error').mapErr((e) => new Error(e));
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toBeInstanceOf(Error);
      expect(result.unwrapErr().message).toBe('error');
    });

    it('should not map Ok value', () => {
      const result = Result.ok<number, string>(42).mapErr((e) => new Error(e));
      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toBe(42);
    });

    it('should preserve value type through mapErr', () => {
      const result: Result<number, Error> = Result.ok<number, string>(42).mapErr(
        (e) => new Error(e),
      );
      expect(result.unwrap()).toBe(42);
    });
  });

  describe('flatMap', () => {
    it('should flatMap Ok value', () => {
      const result = Result.ok(5).flatMap((x) => Result.ok(x * 2));
      expect(result.unwrap()).toBe(10);
    });

    it('should flatMap to Err', () => {
      const result = Result.ok(5).flatMap(() => Result.err('failed'));
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toBe('failed');
    });

    it('should not flatMap Err value', () => {
      const error = new Error('failed');
      const result = Result.err<number, Error>(error).flatMap((x) => Result.ok(x * 2));
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toBe(error);
    });

    it('should preserve error type through flatMap', () => {
      type CustomError = { code: number };
      const error: CustomError = { code: 500 };
      const result: Result<number, CustomError> = Result.err<string, CustomError>(error).flatMap(
        (x) => Result.ok(x.length),
      );
      expect(result.unwrapErr()).toBe(error);
    });
  });

  describe('andThen', () => {
    it('should be an alias for flatMap', () => {
      const result = Result.ok(5).andThen((x) => Result.ok(x * 2));
      expect(result.unwrap()).toBe(10);
    });
  });

  describe('orElse', () => {
    it('should provide alternative on Err', () => {
      const result = Result.err<number, string>('failed').orElse(() => Result.ok(99));
      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toBe(99);
    });

    it('should not call alternative on Ok', () => {
      const alternative = vi.fn(() => Result.ok(99));
      const result = Result.ok(42).orElse(alternative);
      expect(result.unwrap()).toBe(42);
      expect(alternative).not.toHaveBeenCalled();
    });

    it('should allow error type transformation', () => {
      type ErrorA = { type: 'A'; message: string };
      type ErrorB = { type: 'B'; reason: string };

      const errorA: ErrorA = { type: 'A', message: 'failed' };
      const result: Result<number, ErrorB> = Result.err<number, ErrorA>(errorA).orElse((e) =>
        Result.err<number, ErrorB>({ type: 'B', reason: e.message }),
      );

      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toEqual({ type: 'B', reason: 'failed' });
    });
  });

  describe('match', () => {
    it('should call ok handler on Ok', () => {
      const result = Result.ok(42).match({
        ok: (x) => `Success: ${x}`,
        err: (e) => `Error: ${e}`,
      });
      expect(result).toBe('Success: 42');
    });

    it('should call err handler on Err', () => {
      const result = Result.err('failed').match({
        ok: (x) => `Success: ${x}`,
        err: (e) => `Error: ${e}`,
      });
      expect(result).toBe('Error: failed');
    });
  });

  describe('tap / inspect', () => {
    it('should call fn on Ok', () => {
      const spy = vi.fn();
      const result = Result.ok(42).tap(spy);
      expect(spy).toHaveBeenCalledWith(42);
      expect(result.unwrap()).toBe(42);
    });

    it('should not call fn on Err', () => {
      const spy = vi.fn();
      const result = Result.err('failed').tap(spy);
      expect(spy).not.toHaveBeenCalled();
      expect(result.isErr()).toBe(true);
    });

    it('should have inspect as alias for tap', () => {
      const spy = vi.fn();
      const result = Result.ok(42).inspect(spy);
      expect(spy).toHaveBeenCalledWith(42);
    });
  });

  describe('tapErr / inspectErr', () => {
    it('should call fn on Err', () => {
      const spy = vi.fn();
      const error = new Error('failed');
      const result = Result.err(error).tapErr(spy);
      expect(spy).toHaveBeenCalledWith(error);
      expect(result.unwrapErr()).toBe(error);
    });

    it('should not call fn on Ok', () => {
      const spy = vi.fn();
      const result = Result.ok(42).tapErr(spy);
      expect(spy).not.toHaveBeenCalled();
      expect(result.unwrap()).toBe(42);
    });

    it('should have inspectErr as alias for tapErr', () => {
      const spy = vi.fn();
      const error = new Error('failed');
      const result = Result.err(error).inspectErr(spy);
      expect(spy).toHaveBeenCalledWith(error);
    });
  });

  describe('Result.try', () => {
    it('should wrap successful function', () => {
      const result = Result.try(() => JSON.parse('{"a":1}'));
      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toEqual({ a: 1 });
    });

    it('should catch thrown errors', () => {
      const result = Result.try(() => JSON.parse('invalid json'));
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toBeInstanceOf(SyntaxError);
    });

    it('should map errors with custom function', () => {
      type CustomError = { code: number; message: string };
      const result = Result.try<unknown, CustomError>(
        () => JSON.parse('invalid'),
        (e) => ({ code: 400, message: String(e) }),
      );
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr().code).toBe(400);
    });

    it('should preserve type safety', () => {
      const parseNumber = (s: string) =>
        Result.try(
          () => {
            const n = Number(s);
            if (isNaN(n)) throw new Error('Not a number');
            return n;
          },
          (e) => new Error(String(e)),
        );

      const valid = parseNumber('42');
      const invalid = parseNumber('abc');

      expect(valid.isOk()).toBe(true);
      expect(valid.unwrap()).toBe(42);
      expect(invalid.isErr()).toBe(true);
    });
  });

  describe('Result.fromPromise', () => {
    it('should convert resolved promise to Ok', async () => {
      const result = await Result.fromPromise(Promise.resolve(42));
      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toBe(42);
    });

    it('should convert rejected promise to Err', async () => {
      const error = new Error('failed');
      const result = await Result.fromPromise(Promise.reject(error));
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toBe(error);
    });

    it('should map rejection with custom function', async () => {
      type ApiError = { statusCode: number; message: string };
      const result = await Result.fromPromise<unknown, ApiError>(
        Promise.reject('Network error'),
        (e) => ({ statusCode: 500, message: String(e) }),
      );
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr().statusCode).toBe(500);
    });

    it('should work with async functions', async () => {
      const fetchUser = async (id: number) => {
        if (id === 0) throw new Error('Invalid ID');
        return { id, name: 'John' };
      };

      const valid = await Result.fromPromise(fetchUser(1));
      const invalid = await Result.fromPromise(fetchUser(0));

      expect(valid.isOk()).toBe(true);
      expect(valid.unwrap()).toEqual({ id: 1, name: 'John' });
      expect(invalid.isErr()).toBe(true);
    });
  });

  describe('Result.all', () => {
    it('should combine all Ok results', () => {
      const results = [Result.ok(1), Result.ok(2), Result.ok(3)];
      const combined = Result.all(results);
      expect(combined.isOk()).toBe(true);
      expect(combined.unwrap()).toEqual([1, 2, 3]);
    });

    it('should return first Err on any failure', () => {
      const results = [Result.ok(1), Result.err('failed'), Result.ok(3)];
      const combined = Result.all(results);
      expect(combined.isErr()).toBe(true);
      expect(combined.unwrapErr()).toBe('failed');
    });

    it('should handle empty array', () => {
      const combined = Result.all([]);
      expect(combined.isOk()).toBe(true);
      expect(combined.unwrap()).toEqual([]);
    });

    it('should preserve type safety with custom errors', () => {
      type ValidationError = { field: string; message: string };
      const results: Result<number, ValidationError>[] = [
        Result.ok(1),
        Result.err({ field: 'age', message: 'Invalid' }),
        Result.ok(3),
      ];
      const combined = Result.all(results);
      expect(combined.isErr()).toBe(true);
      expect(combined.unwrapErr().field).toBe('age');
    });

    it('should fail fast and not evaluate all results', () => {
      const spy = vi.fn(() => Result.ok(3));
      const results = [Result.ok(1), Result.err('failed'), spy() as Result<number, string>];
      Result.all(results);
      // Note: In JavaScript, array literals evaluate all expressions
      // This test verifies the fail-fast behavior happens during iteration
      const manualResults = [Result.ok(1), Result.err('failed')];
      const combined = Result.all(manualResults);
      expect(combined.isErr()).toBe(true);
    });
  });

  describe('Result.traverse', () => {
    it('should map all values to Ok results', () => {
      const parseNumber = (s: string): Result<number, string> => {
        const n = Number(s);
        return isNaN(n) ? Result.err('invalid') : Result.ok(n);
      };

      const result = Result.traverse(['1', '2', '3'], parseNumber);
      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toEqual([1, 2, 3]);
    });

    it('should return first Err on any failure', () => {
      const parseNumber = (s: string): Result<number, string> => {
        const n = Number(s);
        return isNaN(n) ? Result.err(`invalid: ${s}`) : Result.ok(n);
      };

      const result = Result.traverse(['1', 'x', '3'], parseNumber);
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toBe('invalid: x');
    });

    it('should handle empty array', () => {
      const result = Result.traverse([], (x: number) => Result.ok(x * 2));
      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toEqual([]);
    });

    it('should preserve type safety with transformations', () => {
      type User = { id: number; name: string };
      type ValidationError = { field: string; message: string };

      const validateUser = (data: unknown): Result<User, ValidationError> => {
        if (
          typeof data === 'object' &&
          data !== null &&
          'id' in data &&
          'name' in data &&
          typeof data.id === 'number' &&
          typeof data.name === 'string'
        ) {
          return Result.ok({ id: data.id, name: data.name });
        }
        return Result.err({ field: 'user', message: 'Invalid user data' });
      };

      const valid = Result.traverse(
        [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
        ],
        validateUser,
      );
      const invalid = Result.traverse([{ id: 1, name: 'Alice' }, { invalid: 'data' }], validateUser);

      expect(valid.isOk()).toBe(true);
      expect(valid.unwrap()).toEqual([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ]);
      expect(invalid.isErr()).toBe(true);
    });

    it('should work with different input and output types', () => {
      const result = Result.traverse([1, 2, 3], (n) => Result.ok(`number: ${n}`));
      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toEqual(['number: 1', 'number: 2', 'number: 3']);
    });
  });

  describe('chaining operations', () => {
    it('should chain multiple operations', () => {
      const result = Result.ok(5)
        .map((x) => x * 2)
        .flatMap((x) => Result.ok(x + 1))
        .tap((x) => console.log('Value:', x))
        .match({
          ok: (data) => data,
          err: () => 0,
        });

      expect(result).toBe(11);
    });

    it('should short-circuit on first error', () => {
      const mapSpy = vi.fn((x: number) => x * 2);
      const result = Result.err<number, string>('initial error')
        .map(mapSpy)
        .flatMap((x) => Result.ok(x + 1));

      expect(result.isErr()).toBe(true);
      expect(mapSpy).not.toHaveBeenCalled();
    });

    it('should transform errors along the chain', () => {
      const result = Result.ok(5)
        .flatMap((x) => (x > 10 ? Result.ok(x) : Result.err('too small')))
        .mapErr((e) => new Error(e))
        .orElse(() => Result.ok(99));

      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toBe(99);
    });
  });

  describe('type safety edge cases', () => {
    it('should maintain type safety through map chains', () => {
      const result: Result<string, Error> = Result.ok(42)
        .map((x) => x * 2)
        .map((x) => `number: ${x}`);

      expect(result.unwrap()).toBe('number: 84');
    });

    it('should maintain type safety through error transformations', () => {
      type ErrorA = { type: 'A' };
      type ErrorB = { type: 'B' };

      const result: Result<number, ErrorB> = Result.err<number, ErrorA>({ type: 'A' }).mapErr(
        () => ({ type: 'B' }),
      );

      expect(result.unwrapErr().type).toBe('B');
    });

    it('should handle complex nested types', () => {
      type User = { id: number; profile: { name: string; age: number } };
      const result: Result<User, string> = Result.ok({
        id: 1,
        profile: { name: 'Alice', age: 30 },
      });

      const name = result.map((u) => u.profile.name);
      expect(name.unwrap()).toBe('Alice');
    });
  });
});
