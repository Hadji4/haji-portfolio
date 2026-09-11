import sanitizeHtml from "sanitize-html";

// The rich text editor (Tiptap) already constrains what a user can produce
// to its own registered node/mark types, but sanitizing again here means a
// crafted form submission that bypasses the editor entirely can't inject
// arbitrary HTML/scripts into stored blog content.
export function sanitizeBlogContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p",
      "br",
      "hr",
      "strong",
      "em",
      "s",
      "u",
      "code",
      "pre",
      "blockquote",
      "h1",
      "h2",
      "h3",
      "ul",
      "ol",
      "li",
      "a",
      "img",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
    },
  });
}
