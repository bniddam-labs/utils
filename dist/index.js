'use strict';

var zod = require('zod');

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
var emailSchema = zod.z.string().email("Invalid email address");
var phoneSchema = zod.z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format (E.164 format expected)");
var urlSchema = zod.z.string().url("Invalid URL format");
var filenameSchema = zod.z.string().min(1, "Filename cannot be empty").max(255, "Filename too long").regex(/^[a-zA-Z0-9._-]+$/, "Filename contains invalid characters");
var slugStringSchema = zod.z.string().min(1).max(100).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Invalid slug format");
var nonEmptyStringSchema = zod.z.string().trim().min(1, "String cannot be empty");
var alphanumericSchema = zod.z.string().regex(/^[a-zA-Z0-9]+$/, "Must contain only letters and numbers");
var hexColorSchema = zod.z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color format");
var createStringSchema = (min, max, message) => zod.z.string().min(min, message).max(max, message);
var createEnumSchema = (values) => zod.z.enum(values);

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
        ...result.errors.map((err2) => __spreadProps(__spreadValues({}, err2), {
          path: `${key}.${err2.path}`
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
  return error.issues.map((err2) => ({
    path: err2.path.join(".") || "root",
    message: err2.message,
    code: err2.code
  }));
}
function createValidator(schema) {
  return (data) => safeParse(schema, data);
}
function createTypeGuard(schema) {
  return (data) => isValid(schema, data);
}

exports.alphanumericSchema = alphanumericSchema;
exports.createEnumSchema = createEnumSchema;
exports.createStringSchema = createStringSchema;
exports.createTypeGuard = createTypeGuard;
exports.createValidator = createValidator;
exports.emailSchema = emailSchema;
exports.err = err;
exports.filenameSchema = filenameSchema;
exports.formatZodErrors = formatZodErrors;
exports.hexColorSchema = hexColorSchema;
exports.isErr = isErr;
exports.isOk = isOk;
exports.isValid = isValid;
exports.map = map;
exports.mapErr = mapErr;
exports.maskCardNumber = maskCardNumber;
exports.maskEmail = maskEmail;
exports.maskPhone = maskPhone;
exports.maskString = maskString;
exports.nonEmptyStringSchema = nonEmptyStringSchema;
exports.normalizeWhitespace = normalizeWhitespace;
exports.ok = ok;
exports.parse = parse;
exports.phoneSchema = phoneSchema;
exports.removeWhitespace = removeWhitespace;
exports.safeParse = safeParse;
exports.sanitizeFilename = sanitizeFilename;
exports.sanitizeSearchInput = sanitizeSearchInput;
exports.slugStringSchema = slugStringSchema;
exports.truncate = truncate;
exports.unwrap = unwrap;
exports.unwrapOr = unwrapOr;
exports.urlSchema = urlSchema;
exports.validateAll = validateAll;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map