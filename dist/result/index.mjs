// src/result/result.ts
function ok(data) {
  return { success: true, data };
}
function err(error) {
  return { success: false, error };
}
function isOk(result) {
  return result.success === true;
}
function isErr(result) {
  return result.success === false;
}
function unwrap(result) {
  if (isOk(result)) {
    return result.data;
  }
  throw result.error;
}
function unwrapOr(result, defaultValue) {
  if (isOk(result)) {
    return result.data;
  }
  return defaultValue;
}
function map(result, fn) {
  if (isOk(result)) {
    return ok(fn(result.data));
  }
  return result;
}
function mapErr(result, fn) {
  if (isErr(result)) {
    return err(fn(result.error));
  }
  return result;
}

export { err, isErr, isOk, map, mapErr, ok, unwrap, unwrapOr };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map