'use strict';

var zod = require('zod');

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
    throw new Error(
      `Cannot sanitize filename: "${filename}" results in an empty or invalid filename after sanitization`
    );
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
var emailSchema = zod.z.email({ error: "Invalid email address" });
var phoneSchema = zod.z.string().regex(/^\+?[1-9]\d{1,14}$/, { error: "Invalid phone number format (E.164 format expected)" });
var urlSchema = zod.z.string().url({ error: "Invalid URL format" });
var filenameSchema = zod.z.string().min(1, { error: "Filename cannot be empty" }).max(255, { error: "Filename too long" }).regex(/^[a-zA-Z0-9._-]+$/, { error: "Filename contains invalid characters" });
var slugStringSchema = zod.z.string().min(1).max(100).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, { error: "Invalid slug format" });
var nonEmptyStringSchema = zod.z.string().trim().min(1, { error: "String cannot be empty" });
var alphanumericSchema = zod.z.string().regex(/^[a-zA-Z0-9]+$/, { error: "Must contain only letters and numbers" });
var hexColorSchema = zod.z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { error: "Invalid hex color format" });
var createStringSchema = (min, max, message) => zod.z.string().min(min, message ? { error: message } : void 0).max(max, message ? { error: message } : void 0);
var createEnumSchema = (values) => zod.z.enum(values);

exports.alphanumericSchema = alphanumericSchema;
exports.createEnumSchema = createEnumSchema;
exports.createStringSchema = createStringSchema;
exports.emailSchema = emailSchema;
exports.filenameSchema = filenameSchema;
exports.hexColorSchema = hexColorSchema;
exports.maskCardNumber = maskCardNumber;
exports.maskEmail = maskEmail;
exports.maskPhone = maskPhone;
exports.maskString = maskString;
exports.nonEmptyStringSchema = nonEmptyStringSchema;
exports.normalizeWhitespace = normalizeWhitespace;
exports.phoneSchema = phoneSchema;
exports.removeWhitespace = removeWhitespace;
exports.sanitizeFilename = sanitizeFilename;
exports.sanitizeSearchInput = sanitizeSearchInput;
exports.slugStringSchema = slugStringSchema;
exports.truncate = truncate;
exports.urlSchema = urlSchema;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map