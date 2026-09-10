import { z } from "zod";

// Users commonly type "example.com" instead of "https://example.com" — treat
// that as valid input instead of a validation error.
export function normalizeUrlInput(value: FormDataEntryValue | null): string {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

// Runs a zod schema and turns a ZodError into a single readable message
// (e.g. "liveUrl: Invalid URL") instead of letting the raw issues array
// bubble up as an unhandled exception in the server action.
export function parseFormData<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issue = result.error.issues[0];
    const field = issue.path.join(".") || "input";
    throw new Error(`${field}: ${issue.message}`);
  }
  return result.data;
}

export const contactSchema = z.object({
  name: z.string().min(2, "Name is too short").max(100),
  email: z.string().email("Enter a valid email"),
  subject: z.string().max(150).optional().or(z.literal("")),
  message: z.string().min(10, "Message is too short").max(4000),
  // Honeypot field — real users never fill this in.
  company: z.string().optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const projectSchema = z.object({
  title: z.string().min(2).max(150),
  slug: z
    .string()
    .min(2)
    .max(150)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only"),
  category: z.string().min(2).max(100),
  summary: z.string().min(10).max(300),
  description: z.string().min(10),
  techStack: z.array(z.string().min(1)).min(1, "Add at least one technology"),
  features: z.array(z.string().min(1)).min(1, "Add at least one feature"),
  scale: z.string().max(200).optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
  repoNote: z.string().max(200).optional().or(z.literal("")),
  accent: z.string().min(1),
  featured: z.boolean(),
  order: z.coerce.number().int(),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export const skillSchema = z.object({
  category: z.string().min(2).max(100),
  name: z.string().min(1).max(100),
  order: z.coerce.number().int(),
});

export const experienceSchema = z.object({
  role: z.string().min(2).max(150),
  organization: z.string().min(2).max(200),
  period: z.string().max(100).optional().or(z.literal("")),
  description: z.string().min(2),
  order: z.coerce.number().int(),
});

export const educationSchema = z.object({
  title: z.string().min(2).max(250),
  institution: z.string().max(200).optional().or(z.literal("")),
  order: z.coerce.number().int(),
});

export const settingsSchema = z.object({
  heroName: z.string().min(2).max(150),
  heroTitle: z.string().min(2).max(200),
  heroIntro: z.string().min(10),
  email: z.string().email(),
  phone: z.string().min(3).max(50),
  github: z.string().url().optional().or(z.literal("")),
  telegram: z.string().url().optional().or(z.literal("")),
  cvUrl: z.string().max(300).optional().or(z.literal("")),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name is too short").max(150),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from the current password",
    path: ["newPassword"],
  });

export const galleryItemSchema = z.object({
  caption: z.string().max(200).optional().or(z.literal("")),
  order: z.coerce.number().int(),
});

export const documentSchema = z.object({
  title: z.string().min(2, "Title is too short").max(200),
  category: z.string().min(2, "Category is required").max(100),
  published: z.boolean(),
  order: z.coerce.number().int(),
});

export const blogPostSchema = z.object({
  title: z.string().min(2, "Title is too short").max(200),
  slug: z
    .string()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only"),
  excerpt: z.string().min(10, "Excerpt is too short").max(300),
  content: z.string().min(20, "Content is too short"),
  tags: z.array(z.string().min(1)),
  published: z.boolean(),
});
