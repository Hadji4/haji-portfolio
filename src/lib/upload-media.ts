const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

export type GalleryMediaType = "image" | "video";

export type GalleryMediaValidation =
  | { error: string; mediaType?: undefined }
  | { error?: undefined; mediaType: GalleryMediaType };

export function validateGalleryMedia(value: FormDataEntryValue | null): GalleryMediaValidation {
  if (!(value instanceof File) || value.size === 0) {
    return { error: "Choose a photo or video to upload" };
  }
  if (IMAGE_TYPES.includes(value.type)) {
    if (value.size > MAX_IMAGE_BYTES) return { error: "Images must be under 10MB" };
    return { mediaType: "image" };
  }
  if (VIDEO_TYPES.includes(value.type)) {
    if (value.size > MAX_VIDEO_BYTES) return { error: "Videos must be under 50MB" };
    return { mediaType: "video" };
  }
  return { error: "File must be an image (JPEG, PNG, WebP, GIF) or a video (MP4, WebM, MOV)" };
}
