import { vec2, vec3 } from "gl-matrix";

export type Vertex = {
  position: vec3;
  velocity: vec3;
  color: vec3;
  texCoord: vec2;
  radius: number;
  mass: number;
};

export async function loadImageBitmap(url: string) {
  const res = await fetch(url);
  const blob = await res.blob();
  return await createImageBitmap(blob, { colorSpaceConversion: "none" });
}

export async function generateMips(
  src: ImageBitmap,
  maxMipLevels: number
): Promise<ImageBitmap[]> {
  let mip = src;
  const mips: ImageBitmap[] = [mip];

  let currentMipLevel = 0;
  while (currentMipLevel < maxMipLevels && (mip.width > 1 || mip.height > 1)) {
    mip = await createNextMipLevelRgba8Unorm(mip);
    mips.push(mip);
    currentMipLevel++;
  }

  return mips;
}

export async function createNextMipLevelRgba8Unorm(
  img: ImageBitmap
): Promise<ImageBitmap> {
  // Compute the size of the next mip
  const dstWidth = Math.max(1, (img.width / 2) | 0);
  const dstHeight = Math.max(1, (img.height / 2) | 0);

  // Create a canvas element to draw the resized image
  const canvas = document.createElement("canvas");
  canvas.width = dstWidth;
  canvas.height = dstHeight;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Unable to get 2D context");
  }

  // Resize the image using canvas
  ctx.drawImage(img, 0, 0, dstWidth, dstHeight);

  // Convert the canvas to ImageBitmap and return
  return createImageBitmap(canvas);
}

export const getRandomFloat = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

const degree = Math.PI / 180;

const radian = 180 / Math.PI;

export function toRadian(a: number) {
  return a * degree;
}

export function toDegree(a: number) {
  return a * radian;
}
