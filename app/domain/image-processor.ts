const PX_PER_MM = 200 / 25.4; // 200 DPI

/**
 * Normalizes and resamples a user-provided image file into a JPEG data URL
 * suitable for embedding in a jsPDF document.
 *
 * The browser decodes the original file via an {@link HTMLImageElement}, then
 * the image is drawn onto an off-screen {@link HTMLCanvasElement} at exactly
 * the pixel dimensions required for the target print size (derived from
 * `targetWidthMm` × `targetHeightMm` at 200 DPI). The canvas is finally
 * exported as a JPEG at 92 % quality.
 *
 * The canvas pipeline converts *any* image format the browser can decode —
 * including raw camera formats, HEIC/HEIF, WebP, AVIF, TIFF, and HDR images
 * (e.g. 10-bit PQ/HLG JPEGs, HDR AVIF) — into a standard 8-bit sRGB JPEG.
 * This avoids compatibility issues with jsPDF (which only supports a narrow
 * set of image formats) and ensures consistent colour rendering across PDF
 * viewers.
 *
 * @param file          - The image file selected by the user.
 * @param targetWidthMm  - Desired print width in millimetres.
 * @param targetHeightMm - Desired print height in millimetres.
 * @returns A JPEG data URL (`data:image/jpeg;base64,…`) at 92 % quality,
 *          resampled to the exact pixel dimensions needed for the target size.
 */
export async function processImage(
  file: File,
  targetWidthMm: number,
  targetHeightMm: number,
): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load image"));
    image.src = dataUrl;
  });

  const targetPxWidth = Math.round(targetWidthMm * PX_PER_MM);
  const targetPxHeight = Math.round(targetHeightMm * PX_PER_MM);

  const canvas = document.createElement("canvas");
  canvas.width = targetPxWidth;
  canvas.height = targetPxHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, targetPxWidth, targetPxHeight);

  return canvas.toDataURL("image/jpeg", 0.92);
}
