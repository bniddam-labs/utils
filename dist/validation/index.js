'use strict';

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

exports.createTypeGuard = createTypeGuard;
exports.createValidator = createValidator;
exports.formatZodErrors = formatZodErrors;
exports.isValid = isValid;
exports.parse = parse;
exports.safeParse = safeParse;
exports.validateAll = validateAll;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map