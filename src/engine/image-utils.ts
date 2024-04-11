export default class ImageUtils {
  static async loadImageBitmap(url: string) {
    const res = await fetch(url);
    const blob = await res.blob();
    return await createImageBitmap(blob, { colorSpaceConversion: "none" });
  }

  static async generateMips(
    src: ImageBitmap,
    maxMipLevels: number
  ): Promise<ImageBitmap[]> {
    let mip = src;
    const mips: ImageBitmap[] = [mip];

    let currentMipLevel = 0;
    while (
      currentMipLevel < maxMipLevels &&
      (mip.width > 1 || mip.height > 1)
    ) {
      mip = await this.createNextMipLevelRgba8Unorm(mip);
      mips.push(mip);
      currentMipLevel++;
    }

    return mips;
  }

  private static async createNextMipLevelRgba8Unorm(
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
}
