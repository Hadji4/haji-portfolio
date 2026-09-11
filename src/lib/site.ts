export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// JSON.stringify doesn't escape "<", so admin-entered text containing
// "</script>" could break out of a `dangerouslySetInnerHTML` JSON-LD block.
// Escaping it as a unicode sequence keeps the JSON semantically identical
// while making it inert as markup.
export function toSafeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
