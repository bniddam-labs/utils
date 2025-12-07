import { z } from 'zod';

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
var emailSchema = z.string().email("Invalid email address");
var phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format (E.164 format expected)");
var urlSchema = z.string().url("Invalid URL format");
var filenameSchema = z.string().min(1, "Filename cannot be empty").max(255, "Filename too long").regex(/^[a-zA-Z0-9._-]+$/, "Filename contains invalid characters");
var slugStringSchema = z.string().min(1).max(100).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Invalid slug format");
var nonEmptyStringSchema = z.string().trim().min(1, "String cannot be empty");
var alphanumericSchema = z.string().regex(/^[a-zA-Z0-9]+$/, "Must contain only letters and numbers");
var hexColorSchema = z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color format");
var createStringSchema = (min, max, message) => z.string().min(min, message).max(max, message);
var createEnumSchema = (values) => z.enum(values);

export { alphanumericSchema, createEnumSchema, createStringSchema, emailSchema, filenameSchema, hexColorSchema, maskCardNumber, maskEmail, maskPhone, maskString, nonEmptyStringSchema, normalizeWhitespace, phoneSchema, removeWhitespace, sanitizeFilename, sanitizeSearchInput, slugStringSchema, truncate, urlSchema };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map