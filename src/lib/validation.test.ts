import { describe, it, expect } from "vitest";
import { contactSchema, projectSchema, changePasswordSchema, normalizeUrlInput } from "./validation";

describe("contactSchema", () => {
  it("accepts a valid submission", () => {
    const result = contactSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "Hello, I'd like to get in touch about a project.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = contactSchema.safeParse({
      name: "Jane Doe",
      email: "not-an-email",
      message: "Hello, I'd like to get in touch about a project.",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a too-short message", () => {
    const result = contactSchema.safeParse({ name: "Jane Doe", email: "jane@example.com", message: "hi" });
    expect(result.success).toBe(false);
  });
});

describe("projectSchema", () => {
  it("rejects a slug with uppercase or spaces", () => {
    const base = {
      title: "My Project",
      slug: "My Project",
      category: "Web",
      summary: "A short summary that is long enough.",
      description: "A longer description that is long enough.",
      techStack: ["Next.js"],
      features: ["Feature one"],
      accent: "violet",
      featured: false,
      order: 0,
    };
    expect(projectSchema.safeParse(base).success).toBe(false);
    expect(projectSchema.safeParse({ ...base, slug: "my-project" }).success).toBe(true);
  });
});

describe("changePasswordSchema", () => {
  it("rejects mismatched confirmation", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "current-pass",
      newPassword: "newpassword1",
      confirmPassword: "different1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects reusing the current password", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "samepassword",
      newPassword: "samepassword",
      confirmPassword: "samepassword",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a valid change", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "old-password",
      newPassword: "brand-new-password",
      confirmPassword: "brand-new-password",
    });
    expect(result.success).toBe(true);
  });
});

describe("normalizeUrlInput", () => {
  it("adds https:// when the scheme is missing", () => {
    expect(normalizeUrlInput("example.com")).toBe("https://example.com");
  });

  it("leaves an existing scheme alone", () => {
    expect(normalizeUrlInput("http://example.com")).toBe("http://example.com");
  });

  it("returns an empty string for empty input", () => {
    expect(normalizeUrlInput(null)).toBe("");
  });
});
