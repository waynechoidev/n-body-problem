import ImageUtils from "./image-utils";

export default class Texture {
  private _device: GPUDevice;
  private _texture?: GPUTexture;

  constructor(device: GPUDevice) {
    this._device = device;
  }

  get view() {
    if (!this._texture) console.error("You need to initialize texture first!");
    return this._texture!.createView();
  }

  public async initialize(imgSrc: string, maxMipLevel = 0) {
    const img = await ImageUtils.loadImageBitmap(imgSrc);
    const mips = await ImageUtils.generateMips(img, maxMipLevel);

    this._texture = this._device.createTexture({
      label: "yellow F on red",
      size: [mips[0].width, mips[0].height],
      mipLevelCount: mips.length,
      format: "rgba8unorm",
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT,
    });
    if (!this._texture) {
      console.error("Failed to load texture");
      return;
    }
    mips.forEach((img, index) => {
      this._device.queue.copyExternalImageToTexture(
        { source: img, flipY: false },
        { texture: this._texture!, mipLevel: index }, // Set the mip level for each copy operation
        { width: img.width, height: img.height }
      );
    });
  }
}
