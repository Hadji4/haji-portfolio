import { describe, it, expect } from "vitest";
import { sanitizeBlogContent } from "./sanitize-content";

describe("sanitizeBlogContent", () => {
  it("keeps content produced by the rich text editor's allowed tags", () => {
    const html = "<h2>Heading</h2><p>Some <strong>bold</strong> and <em>italic</em> text.</p><ul><li>Item</li></ul>";
    expect(sanitizeBlogContent(html)).toBe(html);
  });

  it("strips script tags and inline event handlers", () => {
    const result = sanitizeBlogContent('<p>Hello</p><script>alert(1)</script><img src="x.jpg" onerror="alert(2)">');
    expect(result).not.toContain("<script>");
    expect(result).not.toContain("onerror");
    expect(result).toContain("<p>Hello</p>");
  });

  it("forces safe rel attributes on links", () => {
    const result = sanitizeBlogContent('<a href="https://example.com">link</a>');
    expect(result).toContain('rel="noopener noreferrer"');
  });

  it("drops disallowed tags but keeps their text content", () => {
    const result = sanitizeBlogContent("<div><p>Kept</p><iframe src=\"evil.com\"></iframe></div>");
    expect(result).not.toContain("<iframe");
    expect(result).not.toContain("<div>");
    expect(result).toContain("<p>Kept</p>");
  });
});
