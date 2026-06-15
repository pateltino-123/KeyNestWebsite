/**
 * Sanitize plain-text input to prevent log injection, CRLF injection,
 * and other basic string-based attacks.
 *
 * - Trims leading/trailing whitespace
 * - Strips control characters (except common whitespace)
 * - Collapses multiple newlines into at most two
 * - Truncates to a maximum length
 */
export function sanitizeText(input: string, maxLength = 1000): string {
  return input
    .trim()
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .slice(0, maxLength);
}

/**
 * Sanitize a value intended for structured logging.
 * Replaces newlines and control characters so a single
 * log line cannot be injected with extra lines.
 */
export function sanitizeLog(value: string): string {
  return value
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .replace(/\n|\r/g, " ");
}
