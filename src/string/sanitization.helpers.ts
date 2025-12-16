/**
 * Sanitize a filename to prevent path traversal and other attacks
 *
 * - Removes null bytes
 * - Keeps only alphanumeric, dots, hyphens, underscores
 * - Removes leading/trailing dots and underscores
 * - Collapses multiple dots
 * - Truncates to max length (default: 255)
 * - Ensures filename is not empty
 *
 * @param filename - Original filename
 * @param maxLength - Maximum filename length (default: 255)
 * @returns Sanitized filename
 *
 * @example
 * ```ts
 * sanitizeFilename('../../etc/passwd'); // 'etc_passwd'
 * sanitizeFilename('my file (1).txt'); // 'my_file_1.txt'
 * sanitizeFilename(''); // 'file.bin'
 * ```
 */
export function sanitizeFilename(filename: string, maxLength: number = 255): string {
  // Remove null bytes first
  let sanitized = filename.replace(/\0/g, '');

  // Replace ALL dangerous characters including path separators
  // Keep ONLY alphanumeric, dots, hyphens, underscores
  sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '_');

  // Remove leading/trailing dots and underscores
  sanitized = sanitized.replace(/^[._]+|[._]+$/g, '');

  // Prevent double extensions and collapse multiple dots
  sanitized = sanitized.replace(/\.+/g, '.');

  // Extract extension for length calculation
  const dotIndex = sanitized.lastIndexOf('.');
  const ext = dotIndex > 0 ? sanitized.slice(dotIndex) : '';
  const nameWithoutExt = dotIndex > 0 ? sanitized.slice(0, dotIndex) : sanitized;

  // Truncate if too long (total length including extension)
  if (sanitized.length > maxLength) {
    const maxNameLength = maxLength - ext.length;
    sanitized = nameWithoutExt.slice(0, maxNameLength) + ext;
  }

  // Ensure filename is not empty after sanitization
  if (!sanitized || sanitized === ext || sanitized.length === 0) {
    throw new Error(
      `Cannot sanitize filename: "${filename}" results in an empty or invalid filename after sanitization`,
    );
  }

  return sanitized;
}

/**
 * Sanitize search input to prevent SQL wildcard abuse
 *
 * Escapes special characters used in SQL LIKE patterns:
 * - % (wildcard for any characters)
 * - _ (wildcard for single character)
 * - \ (escape character)
 *
 * @param search - Search string
 * @returns Sanitized search string
 *
 * @example
 * ```ts
 * sanitizeSearchInput('100%'); // '100\\%'
 * sanitizeSearchInput('user_test'); // 'user\\_test'
 * ```
 */
export function sanitizeSearchInput(search: string): string {
  return search.replace(/[%_\\]/g, '\\$&');
}

/**
 * Truncate a string to a maximum length with ellipsis
 *
 * @param str - String to truncate
 * @param maxLength - Maximum length (default: 100)
 * @param ellipsis - Ellipsis string (default: '...')
 * @returns Truncated string
 *
 * @example
 * ```ts
 * truncate('This is a very long string', 10); // 'This is...'
 * truncate('Short', 10); // 'Short'
 * ```
 */
export function truncate(str: string, maxLength: number = 100, ellipsis: string = '...'): string {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength - ellipsis.length) + ellipsis;
}

/**
 * Remove all whitespace from a string
 *
 * @param str - String to process
 * @returns String without whitespace
 *
 * @example
 * ```ts
 * removeWhitespace('  hello  world  '); // 'helloworld'
 * ```
 */
export function removeWhitespace(str: string): string {
  return str.replace(/\s+/g, '');
}

/**
 * Normalize whitespace (collapse multiple spaces to single space and trim)
 *
 * @param str - String to normalize
 * @returns Normalized string
 *
 * @example
 * ```ts
 * normalizeWhitespace('  hello    world  '); // 'hello world'
 * ```
 */
export function normalizeWhitespace(str: string): string {
  return str.replace(/\s+/g, ' ').trim();
}
