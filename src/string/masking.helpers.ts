/**
 * Mask an email address, keeping first few characters and domain visible
 *
 * @param email - Email address to mask
 * @param visibleChars - Number of visible characters at start (default: 2)
 * @returns Masked email
 *
 * @example
 * ```ts
 * maskEmail('john.doe@example.com'); // 'jo***@example.com'
 * maskEmail('a@test.com'); // 'a***@test.com'
 * ```
 */
export function maskEmail(email: string, visibleChars: number = 2): string {
  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) {
    return email; // Invalid email format
  }

  const visiblePart = localPart.slice(0, Math.min(visibleChars, localPart.length));
  return `${visiblePart}***@${domain}`;
}

/**
 * Mask a phone number, keeping last few digits visible
 *
 * @param phone - Phone number to mask
 * @param visibleDigits - Number of visible digits at end (default: 4)
 * @returns Masked phone number
 *
 * @example
 * ```ts
 * maskPhone('+1234567890'); // '******7890'
 * maskPhone('555-123-4567', 4); // '***-***-4567'
 * ```
 */
export function maskPhone(phone: string, visibleDigits: number = 4): string {
  if (phone.length <= visibleDigits) {
    return '*'.repeat(phone.length);
  }

  const masked = phone
    .slice(0, -visibleDigits)
    .replace(/[0-9]/g, '*');
  const visible = phone.slice(-visibleDigits);

  return masked + visible;
}

/**
 * Mask a credit card number, keeping last 4 digits visible
 *
 * @param cardNumber - Card number to mask
 * @param visibleDigits - Number of visible digits at end (default: 4)
 * @param separator - Separator character (default: ' ')
 * @returns Masked card number
 *
 * @example
 * ```ts
 * maskCardNumber('1234567812345678'); // '**** **** **** 5678'
 * maskCardNumber('1234-5678-1234-5678', 4, '-'); // '****-****-****-5678'
 * ```
 */
export function maskCardNumber(
  cardNumber: string,
  visibleDigits: number = 4,
  separator: string = ' ',
): string {
  // Remove all non-digit characters
  const digitsOnly = cardNumber.replace(/\D/g, '');

  if (digitsOnly.length <= visibleDigits) {
    return '*'.repeat(digitsOnly.length);
  }

  const visible = digitsOnly.slice(-visibleDigits);
  const maskedCount = digitsOnly.length - visibleDigits;

  // Group in chunks of 4
  const maskedGroups = Math.ceil(maskedCount / 4);
  const masked = Array(maskedGroups)
    .fill('****')
    .join(separator);

  return `${masked}${separator}${visible}`;
}

/**
 * Mask a string, keeping first and last few characters visible
 *
 * @param str - String to mask
 * @param visibleStart - Number of visible characters at start (default: 2)
 * @param visibleEnd - Number of visible characters at end (default: 2)
 * @param maskChar - Masking character (default: '*')
 * @returns Masked string
 *
 * @example
 * ```ts
 * maskString('secrettoken123', 2, 2); // 'se********23'
 * maskString('abc', 1, 1); // 'a*c'
 * ```
 */
export function maskString(
  str: string,
  visibleStart: number = 2,
  visibleEnd: number = 2,
  maskChar: string = '*',
): string {
  if (str.length <= visibleStart + visibleEnd) {
    return str;
  }

  const start = str.slice(0, visibleStart);
  const end = str.slice(-visibleEnd);
  const maskedLength = str.length - visibleStart - visibleEnd;

  return `${start}${maskChar.repeat(maskedLength)}${end}`;
}
