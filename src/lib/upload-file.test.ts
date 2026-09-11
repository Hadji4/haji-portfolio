import { describe, it, expect } from "vitest";
import { validateDocumentFile } from "./upload-file";
import { validateImageFile } from "./upload-image";
import { validateGalleryMedia } from "./upload-media";

function makeFile(type: string, sizeBytes: number, name = "file"): File {
  return new File([new Uint8Array(sizeBytes)], name, { type });
}

describe("validateDocumentFile", () => {
  it("rejects a non-File value", () => {
    expect(validateDocumentFile(null)).toBeTruthy();
    expect(validateDocumentFile("not-a-file")).toBeTruthy();
  });

  it("rejects a disallowed MIME type", () => {
    const file = makeFile("application/x-msdownload", 1024, "evil.exe");
    expect(validateDocumentFile(file)).toBeTruthy();
  });

  it("rejects a file over the size limit", () => {
    const file = makeFile("application/pdf", 16 * 1024 * 1024);
    expect(validateDocumentFile(file)).toBeTruthy();
  });

  it("accepts a valid PDF under the limit", () => {
    const file = makeFile("application/pdf", 1024);
    expect(validateDocumentFile(file)).toBeNull();
  });
});

describe("validateImageFile", () => {
  it("rejects an unsupported image type", () => {
    expect(validateImageFile(makeFile("image/svg+xml", 1024))).toBeTruthy();
  });

  it("accepts a valid PNG under the limit", () => {
    expect(validateImageFile(makeFile("image/png", 1024))).toBeNull();
  });
});

describe("validateGalleryMedia", () => {
  it("classifies an image", () => {
    expect(validateGalleryMedia(makeFile("image/jpeg", 1024))).toEqual({ mediaType: "image" });
  });

  it("classifies a video", () => {
    expect(validateGalleryMedia(makeFile("video/mp4", 1024))).toEqual({ mediaType: "video" });
  });

  it("rejects an oversized video", () => {
    const result = validateGalleryMedia(makeFile("video/mp4", 51 * 1024 * 1024));
    expect(result.error).toBeTruthy();
  });

  it("rejects an unsupported type", () => {
    const result = validateGalleryMedia(makeFile("application/zip", 1024));
    expect(result.error).toBeTruthy();
  });
});
